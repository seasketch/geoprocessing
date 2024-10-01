import bundleFeatures from "./bundleFeatures.js";
import ora from "ora";
import { program } from "commander";
import { createPool } from "slonik";
import printSizeHistogram from "./printSizeHistogram.js";
import inquirer from "inquirer";
import {
  getDataSourceVersion,
  createBucket,
  createCloudfrontDistribution,
  putBundle,
  putResources,
  invalidateCloudfrontDistribution,
  CloudfrontDistributionDetails,
  scheduleObjectsForDeletion,
} from "./aws.js";
import { BBox } from "geojson";
import prettyBytes from "pretty-bytes";
import { loadConfig } from "@smithy/node-config-provider";
import { createIndexes } from "./indexes.js";
import {
  NODE_REGION_CONFIG_FILE_OPTIONS,
  NODE_REGION_CONFIG_OPTIONS,
} from "@smithy/config-resolver";

const region = await loadConfig(
  NODE_REGION_CONFIG_OPTIONS,
  NODE_REGION_CONFIG_FILE_OPTIONS,
)();

const DEFAULT_FLATBUSH_NODE_SIZE = 9;
const DEFAULT_COMPOSITE_INDEX_SIZE_TARGET = 80_000;
const DEFAULT_MIN_COMPOSITE_INDEXES = 3;

program
  .command("bundle-features <datasource-name> <table>")
  .option(
    "--points-limit <number>",
    "Maximum number of vertexes in a bundle. Use to target bundle byte sizes",
    "6400",
  )
  .option(
    "--envelope-max-distance <km>",
    "Limit merged feature envelope. Uses st_maxdistance",
    "55",
  )
  .option(
    "--bbox <xmin,ymin,xmax,ymax>",
    "Clip output to bounding box. Useful when tuning points-limit and envelope-max-distance to speed up operation",
  )
  .option(
    "--connection <postgres://...>",
    "Connection string for source postgres database.",
    "postgres://",
  )
  .option(
    "--index-size-target <bytes>",
    "Spatial index will be split into several chunks to match the target size in bytes",
    "80000",
  )
  .option(
    "--flatbush-node-size <int>",
    "Passed directly to flatbush. Lower numbers mean slower index creation but faster searches",
    "9",
  )
  .option(
    "--s3-bucket <bucket>",
    "Will stream features to an s3 bucket while processing",
  )
  .option("--dry-run", "Skip creating resources on s3")
  .action(async function (datasourceName, table, options) {
    let currentVersion = 0;
    let lastPublished: Date | undefined;
    let bucket: string | undefined;
    try {
      const spinner = ora(``);
      let cloudfrontDistroPromise:
        | Promise<CloudfrontDistributionDetails>
        | undefined;
      if (!options.dryRun) {
        spinner.start("Checking for existing hosting resources");
        ({ currentVersion, lastPublished, bucket } =
          await getDataSourceVersion(datasourceName));
        spinner.stop();
        if (!currentVersion || currentVersion === 0) {
          const answers = await inquirer.prompt([
            {
              type: "confirm",
              name: "proceed",
              default: false,
              message: `Existing version not found in ${region}. Would you like to create a new S3 bucket (${datasourceName}) and Cloudfront distro?`,
            },
          ]);
          if (answers.proceed) {
            spinner.start("Creating public S3 bucket");
            const url = await createBucket(datasourceName, region, true);
            spinner.succeed("Public S3 bucket created at " + url);
            cloudfrontDistroPromise = createCloudfrontDistribution(
              datasourceName,
              false,
            );
          } else {
            console.log("Aborted. Try --dry-run if debugging package sizes");
            process.exit();
          }
        } else {
          spinner.succeed(`Found existing hosting resources at ${bucket}`);
        }
      }
      const indexItems: { bbox: BBox; id: number }[] = [];
      const putBundlePromises: Promise<any>[] = [];
      const statsTableName = await bundleFeatures(
        {
          name: datasourceName,
          tableName: table,
          ...options,
        },
        async (id, geobuf, bbox) => {
          indexItems.push({ bbox, id });
          if (!options.dryRun) {
            putBundlePromises.push(
              putBundle(
                // Use a zero-based index to make client implementations easier
                id - 1,
                datasourceName,
                currentVersion + 1,
                geobuf,
              ),
            );
          }
        },
      );
      const pool = await createPool(options.connection, {});
      await pool.connect(async (connection) => {
        await printSizeHistogram(statsTableName, connection);
      });
      // Create, deploy, and show stats on indexes
      // Create main flatbush
      spinner.start("Creating spatial indexes");
      const indexes = createIndexes(
        indexItems.map((i) => i.bbox),
        options.indexSizeTarget || DEFAULT_COMPOSITE_INDEX_SIZE_TARGET,
        DEFAULT_MIN_COMPOSITE_INDEXES,
        options.flatbushNodeSize || DEFAULT_FLATBUSH_NODE_SIZE,
      );
      spinner.succeed(
        `Created spatial index (${prettyBytes(indexes.index.data.byteLength)})`,
      );
      spinner.succeed(
        `Created ${
          indexes.compositeIndexes.length
        } composite indexes (${indexes.compositeIndexes
          .map((i) => prettyBytes(i.index.data.byteLength))
          .join(", ")})`,
      );

      // Output stats on bytes and # requests needed for each example sketch
      if (options.dryRun) {
        console.log(`To deploy this data source, omit --dry-run`);
      } else {
        // Wait for putBundle tasks to complete
        spinner.start("Waiting for all S3 uploads to finish");
        await Promise.all(putBundlePromises);
        spinner.succeed("Uploaded bundles to S3");
        // Save indexes
        // Save metadata document
        spinner.start("Deploying metadata and indexes to S3");
        await putResources(
          datasourceName,
          currentVersion + 1,
          indexes.index,
          indexes.compositeIndexes,
        );
        spinner.succeed("Deployed metadata and indexes to S3");
        // Schedule previous versions for deletion
        if (currentVersion > 0 && lastPublished) {
          spinner.start("Scheduling old versions for deletion");
          const deletesAt = await scheduleObjectsForDeletion(
            datasourceName,
            currentVersion,
            lastPublished,
          );
          spinner.succeed(
            `Scheduled previous version (${currentVersion}) for deletion on ${deletesAt.toLocaleDateString()} at midnight`,
          );
        }

        let details: CloudfrontDistributionDetails;
        // Finish with cloudfront updates
        if (cloudfrontDistroPromise) {
          spinner.start("Creating Cloudfront distribution");
          details = await cloudfrontDistroPromise;
          spinner.succeed(
            "Created Cloudfront distribution at " + details.location,
          );
        } else {
          spinner.start("Creating Cloudfront invalidation");
          details = await invalidateCloudfrontDistribution(datasourceName);
          spinner.succeed("Created Cloudfront invalidation");
        }
        console.log(
          `✅ Version ${
            currentVersion + 1
          } of this data source is now available at https://${details.location}`,
        );
        if (currentVersion === 0) {
          console.log(
            "Since this cloudfront distribution is new, it may take a few minutes before it can be accessed. Future updates to this data source should be immediate.",
          );
        }
      }
    } catch (error) {
      console.log("\n");
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);

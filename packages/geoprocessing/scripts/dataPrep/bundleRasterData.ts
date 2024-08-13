import ora from "ora";
import { program } from "commander";
import { loadConfig } from "@smithy/node-config-provider";
import {
  NODE_REGION_CONFIG_FILE_OPTIONS,
  NODE_REGION_CONFIG_OPTIONS,
} from "@smithy/config-resolver";

import inquirer from "inquirer";
import {
  getDataSourceVersion,
  createBucket,
  createCloudfrontDistribution,
  putRasterBundle,
  putMetadataResources,
  invalidateCloudfrontDistribution,
  CloudfrontDistributionDetails,
  scheduleObjectsForDeletion,
} from "./aws.js";

const region = await loadConfig(
  NODE_REGION_CONFIG_OPTIONS,
  NODE_REGION_CONFIG_FILE_OPTIONS
)();

program
  .command("bundle-rasters <datasource-name>")
  .option("--rasterFile <filename>", "Name of the raster file to copy to s3")
  .option("--dry-run", "Skip creating resources on s3")
  .action(async function (datasourceName, options) {
    let currentVersion = 0;
    let lastPublished: Date | undefined = undefined;
    let bucket: string | undefined;
    let rasterFilename: string;
    try {
      rasterFilename = options.rasterFile;
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
              message: `Existing version not found in ${region}. Would you like to create a new S3 bucket and Cloudfront distro?`,
            },
          ]);
          if (answers.proceed) {
            spinner.start("Creating public S3 bucket");
            const url = await createBucket(datasourceName, region, true);
            spinner.succeed("Public S3 bucket created at " + url);
            cloudfrontDistroPromise = createCloudfrontDistribution(
              datasourceName,
              true
            );
          } else {
            console.log("Aborted. Try --dry-run if debugging package sizes");
            process.exit();
          }
        } else {
          spinner.succeed(`Found existing hosting resources at ${bucket}`);
        }
      }

      const putBundlePromises: Promise<any>[] = [];
      /*
      async (id) => {
        let info = "putting " + id;
        " dsname: " + datasourceName + " with file: " + rasterFilename;

      
        if (!options.dryRun) {
          spinner.start("Trying to put: ", info);
          putBundlePromises.push(
            putRasterBundle(
              // Use a zero-based index to make client implementations easier
              id - 1,
              datasourceName,
              rasterFilename,
              currentVersion + 1
            )
          );
        }
      };
      */
      // Create, deploy, and show stats on indexes
      // Create main flatbush
      spinner.start("Creating spatial indexes");

      // Output stats on bytes and # requests needed for each example sketch
      if (!options.dryRun) {
        // Wait for putBundle tasks to complete
        spinner.start("Waiting for all S3 uploads to finish");
        //await Promise.all(putBundlePromises);
        spinner.succeed("Uploaded bundles to S3");
        // Save indexes
        // Save metadata document
        spinner.start("Deploying metadata for raster to S3");
        await putMetadataResources(datasourceName, currentVersion + 1);
        spinner.succeed("Deployed metadata to S3");
        spinner.succeed("Deploying raster to S3");
        await putRasterBundle(
          datasourceName,
          rasterFilename,
          currentVersion + 1
        );
        spinner.succeed("Deployed raster to S3");
        // Schedule previous versions for deletion
        if (currentVersion > 0 && lastPublished) {
          spinner.start("Scheduling old versions for deletion");
          const deletesAt = await scheduleObjectsForDeletion(
            datasourceName,
            currentVersion,
            lastPublished
          );
          spinner.succeed(
            `Scheduled previous version (${currentVersion}) for deletion on ${deletesAt.toLocaleDateString()} at midnight`
          );
        }

        let details: CloudfrontDistributionDetails;
        // Finish with cloudfront updates
        if (cloudfrontDistroPromise) {
          spinner.start("Creating Cloudfront distribution");
          details = await cloudfrontDistroPromise;
          spinner.succeed(
            "Created Cloudfront distribution at " + details.location
          );
        } else {
          spinner.start("Creating Cloudfront invalidation");
          details = await invalidateCloudfrontDistribution(datasourceName);
          spinner.succeed("Created Cloudfront invalidation");
        }
        console.log(
          `✅ Version ${
            currentVersion + 1
          } of this data source is now available at https://${details.location}`
        );
        if (currentVersion === 0) {
          console.log(
            "Since this cloudfront distribution is new, it may take a few minutes before it can be accessed. Future updates to this data source should be immediate."
          );
        }
      } else {
        console.log(`To deploy this data source, omit --dry-run`);
      }
    } catch (e) {
      console.log("\n");
      console.error(e);
      process.exit(1);
    }
  });

program.parse(process.argv);

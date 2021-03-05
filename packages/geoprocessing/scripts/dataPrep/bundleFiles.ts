import ora from "ora";
import program, { version } from "commander";
import fs from "fs";
import path from "path";
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
} from "./aws";

import AWS from "aws-sdk";

const DEFAULT_FLATBUSH_NODE_SIZE = 9;
const DEFAULT_COMPOSITE_INDEX_SIZE_TARGET = 80_000;
const DEFAULT_MIN_COMPOSITE_INDEXES = 3;

/**
 * ToDO
 * recursively walk folder and copy files to bucket
 * smartly assign content type, age, etc
 * mark older version for deletion
 */

/**
 * Recursively copies folder of files to S3 resource
 * Assumes resource naming scheme - {package-name}-{resource-name}
 * Create public s3 bucket and publishes via Cloudfront if doesn't already exist
 * Smartly assigns content type where possible and schedules older versions for deletion
 */
program
  .command("bundle-files <datasource-name> <data-path>")
  .option("--")
  .option(
    "--dry-run",
    "Review the result of the action without creating s3 resources"
  )
  .action(async function (datasourceName, dataPath, options) {
    let currentVersion = 0;
    let lastPublished: Date | undefined = undefined;
    let bucket: string | undefined;
    try {
      const spinner = ora(``);
      let cloudfrontDistroPromise:
        | Promise<CloudfrontDistributionDetails>
        | undefined;

      // Get files to bundle
      spinner.start("Getting list of files");
      const getFiles = (dir: string) =>
        fs
          .readdirSync(dir)
          .reduce<string[]>(
            (files, file) =>
              fs.statSync(path.join(dir, file)).isDirectory()
                ? files.concat(getFiles(path.join(dir, file)))
                : files.concat(path.join(dir, file)),
            []
          );
      const files =
        fs.existsSync(dataPath) && fs.lstatSync(dataPath).isDirectory()
          ? getFiles(dataPath)
          : [path];
      console.log("Found files:");
      files.forEach((f) => console.log(f));
      spinner.stop();

      if (!options.dryRun) {
        // Check existing resources
        spinner.start("Checking for existing resources");
        ({ currentVersion, lastPublished, bucket } = await getDataSourceVersion(
          datasourceName
        ));
        spinner.stop();

        // Create bucket and cloudfront
        if (!currentVersion || currentVersion === 0) {
          const answers = await inquirer.prompt([
            {
              type: "confirm",
              name: "proceed",
              default: false,
              message: `Existing version not found in ${AWS.config.region}. Would you like to create a new S3 bucket and Cloudfront distro?`,
            },
          ]);

          if (answers.proceed) {
            spinner.start("Creating public S3 bucket");
            const url = await createBucket(datasourceName, true);
            spinner.succeed("Public S3 bucket created at " + url);
            cloudfrontDistroPromise = createCloudfrontDistribution(
              datasourceName,
              true
            );
          } else {
            console.log(
              "Aborted. Try --dry-run to find out what results of command would be"
            );
            process.exit();
          }
        } else {
          spinner.succeed(`Found existing resources at ${bucket}`);
        }
      }

      const putBundlePromises: Promise<any>[] = [];

      // Create metadata.json with file paths
      // Push files to new version
      // Expire old version files

      if (!options.dryRun) {
        // Wait for putBundle tasks to complete
        spinner.start("Waiting for all S3 uploads to finish");
        //await Promise.all(putBundlePromises);
        spinner.succeed("Uploaded bundles to S3");
        spinner.start("Deploying metadata for raster to S3");
        // Save metadata document
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

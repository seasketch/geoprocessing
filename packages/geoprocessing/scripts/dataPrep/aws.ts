import { config, CloudFront, S3 } from "aws-sdk";
import { LifecycleRules } from "aws-sdk/clients/s3.js";
import { Flatbush } from "flatbush";
import { sync } from "read-pkg-up";
import slugify from "../../src/util/slugify.js";
import fetch from "node-fetch";
import { CompositeIndexDetails } from "./indexes.js";
import fs from "fs";

// TODO: Set tags for Cost Center, Author, and Geoprocessing Project using
// geoprocessing.json if available
const cloudfront = new CloudFront({ apiVersion: "2019-03-26" });
const s3 = new S3({ apiVersion: "2006-03-01" });

/**
 * Retrieves metadata from the given DataSource on s3. If a deployed version of
 * the DataSource has not been created yet, 0 will be returned.
 * @export
 * @param {string} name DataSource name
 * @returns {number}
 */
export async function getDataSourceVersion(
  name: string
): Promise<{ currentVersion: number; lastPublished?: Date; bucket?: string }> {
  if (!config.region) {
    throw new Error(
      `AWS region not configured. Set AWS_REGION environment variable or use "aws configure" from the command line.`
    );
  }
  try {
    const url = objectUrl(name, "metadata.json");
    const res = await fetch(url);
    if (res.ok) {
      const metadata: any = await res.json();
      return {
        currentVersion: metadata.version,
        lastPublished: new Date(metadata.published),
        bucket: s3Domain(name),
      };
    } else {
      return { currentVersion: 0 };
    }
  } catch (e) {
    return { currentVersion: 0 };
  }
}

/**
 * Create a bucket on S3 for storing a DataSource
 * @export
 * @param {string} name DataSource name
 * @param {boolean} [publicAccess] Only public DataSources at this time.
 * @returns {Promise<string>} Bucket website url
 */
export async function createBucket(name: string, publicAccess?: boolean) {
  if (publicAccess === false) {
    throw new Error("Private DataSources not yet supported");
  }
  const bucket = bucketName(name);
  await s3
    .createBucket({
      Bucket: bucket,
      ACL: "private",
      CreateBucketConfiguration: {
        LocationConstraint: config.region,
      },
    })
    .promise();
  await s3
    .putBucketCors({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedOrigins: ["*"],
            AllowedMethods: ["GET", "HEAD"],
          },
        ],
      },
    })
    .promise();
  if (publicAccess) {
    await s3
      .putBucketPolicy({
        Bucket: bucket,
        Policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "PublicRead",
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        }),
      })
      .promise();
  }
  return objectUrl(name, "");
}

function bucketName(dataSourceName: string): string {
  return slugify(`${dataSourceName}`.replace(/\W/g, "-").replace(/^-/, ""));
}

function objectUrl(name: string, objectName: string): string {
  return `https://${s3Domain(name)}/${objectName}`;
}

function s3Domain(name: string): string {
  return `${bucketName(name)}.s3.amazonaws.com`;
}

/**
 * Create a CloudFront distribution
 * @export
 * @param {string} name DataSource name
 * @returns {Promise<string>} Distribution url
 */
export async function createCloudfrontDistribution(
  name: string,
  isRaster: boolean
): Promise<CloudfrontDistributionDetails> {
  const id = bucketName(name);
  let defaultRootObject = "metadata.json";
  if (isRaster) {
    defaultRootObject = `${name}.tif`;
  }
  const response = await cloudfront
    .createDistributionWithTags({
      DistributionConfigWithTags: {
        Tags: {
          Items: [
            {
              Key: "SeaSketchDataSource",
              Value: id,
            },
          ],
        },
        DistributionConfig: {
          Comment: id,
          Enabled: true,
          CallerReference: id,
          DefaultRootObject: defaultRootObject,
          Origins: {
            Quantity: 1,
            Items: [
              {
                Id: "s3",
                DomainName: s3Domain(name),
                S3OriginConfig: {
                  OriginAccessIdentity: "",
                },
              },
            ],
          },
          DefaultCacheBehavior: {
            TargetOriginId: "s3",
            // Clients will get origin cache-control but we want cloudfront
            // to keep everything hot. Invalidations can be manually created
            // for metadata.json
            MinTTL: 31536000,
            TrustedSigners: {
              Enabled: false,
              Quantity: 0,
            },
            ForwardedValues: {
              Cookies: {
                Forward: "none",
              },
              QueryString: false,
            },
            DefaultTTL: 31536000,
            ViewerProtocolPolicy: "redirect-to-https",
            AllowedMethods: {
              Quantity: 2,
              Items: ["GET", "HEAD"],
            },
            Compress: true,
          },
        },
      },
    })
    .promise();
  response.Distribution?.ARN;
  return {
    location: response.Distribution!.DomainName,
    arn: response.Distribution!.ARN,
    id: response.Distribution!.Id,
  };
}

/**
 * Save a bundle to the DataSource's s3 bucket.
 * @export
 * @param {number} id
 * @param {number} version
 * @param {Uint8Array} geobuf
 */
export function putBundle(
  id: number,
  dataSourceName: string,
  version: number,
  geobuf: Uint8Array
) {
  return s3
    .putObject({
      Bucket: bucketName(dataSourceName),
      Key: `${version}/${id}.pbf`,
      CacheControl: "max-age=31557600",
      ContentType: "application/protobuf; messageType=geobuf",
      Body: Buffer.from(geobuf),
    })
    .promise();
}
/**
 * Save a bundle to the DataSource's s3 bucket.
 * @export
 * @param {number} id
 * @param {number} version
 * @param {Uint8Array} geobuf
 */
export function putRasterBundle(
  dataSourceName,
  fileName: string,
  version: number
) {
  return s3
    .putObject({
      Bucket: bucketName(dataSourceName),
      Key: `${dataSourceName}.tif`,
      CacheControl: "max-age=31557600",
      ContentType: "image/tiff",
      Body: fs.readFileSync(fileName),
    })
    .promise();
}

/**
 * Save metadata and index resources to s3. Includes metadata.json and index
 * files. Function will split single Flatbush index into a composite index of
 * several files. Authors of geoprocessing function can use the main index or
 * the composites depending on performance needs.
 * @export
 * @param {string} dataSourceName
 * @param {number} version
 * @param {Flatbush} index
 * @param {CompositeIndexDetails} compositeIndexes
 */
export async function putResources(
  dataSourceName: string,
  version: number,
  index: Flatbush,
  compositeIndexes: CompositeIndexDetails[]
) {
  await s3
    .putObject({
      Bucket: bucketName(dataSourceName),
      ContentType: "application/flatbush",
      Body: Buffer.from(index.data),
      Key: `${version}/index.bin`,
      CacheControl: "max-age=31557600",
    })
    .promise();
  for (const compositeIndex of compositeIndexes) {
    await s3
      .putObject({
        Bucket: bucketName(dataSourceName),
        ContentType: "application/flatbush",
        Body: Buffer.from(compositeIndex.index.data),
        Key: `${version}/index.${compositeIndexes.indexOf(compositeIndex)}.bin`,
        CacheControl: "max-age=31557600",
      })
      .promise();
  }
  const pkg = sync()!.packageJson;
  await s3
    .putObject({
      Bucket: bucketName(dataSourceName),
      ContentType: "application/json",
      Key: "metadata.json",
      CacheControl: "max-age=0",
      Body: JSON.stringify(
        {
          name: dataSourceName,
          project: pkg.name,
          homepage: pkg.homepage,
          published: new Date().toISOString(),
          version,
          index: {
            length: index.numItems,
            bytes: index.data.byteLength,
            location: `/${version}/index.bin`,
            rootDir: `/${version}`,
          },
          compositeIndexes: compositeIndexes.map((compositeIndex) => ({
            length: compositeIndexes.length,
            bytes: compositeIndex.index.data.byteLength,
            offset: compositeIndex.offset,
            location: `/${version}/index.${compositeIndexes.indexOf(
              compositeIndex
            )}.bin`,
            rootDir: `/${version}`,
            bbox: compositeIndex.bbox,
          })),
        },
        null,
        "  "
      ),
    })
    .promise();
}

/**
 * Save metadata.json for raster resources to s3. Includes metadata.json.
 * files.
 * @export
 * @param {string} dataSourceName
 * @param {number} version
 */
export async function putMetadataResources(
  dataSourceName: string,
  version: number
) {
  const pkg = sync()!.packageJson;
  await s3
    .putObject({
      Bucket: bucketName(dataSourceName),
      ContentType: "application/json",
      Key: "metadata.json",
      CacheControl: "max-age=0",
      Body: JSON.stringify(
        {
          name: dataSourceName,
          project: pkg.name,
          homepage: pkg.homepage,
          published: new Date().toISOString(),
          version,
        },
        null,
        "  "
      ),
    })
    .promise();
}

/**
 * Invalidate cache of metadata.json related to the DataSource
 * @export
 * @param {string} name DataSource name
 */
export async function invalidateCloudfrontDistribution(name: string) {
  const details = await getCloudfrontDistributionDetails(name);
  await cloudfront
    .createInvalidation({
      DistributionId: details.id,
      InvalidationBatch: {
        CallerReference: new Date().toISOString(),
        Paths: {
          Quantity: 1,
          Items: ["/metadata.json"],
        },
      },
    })
    .promise();
  return details;
}

export interface CloudfrontDistributionDetails {
  location: string;
  arn: string;
  id: string;
}

export async function getCloudfrontDistributionDetails(
  name: string
): Promise<CloudfrontDistributionDetails> {
  const id = bucketName(name);
  const result = await cloudfront
    .listDistributions({
      MaxItems: "10000",
    })
    .promise();
  for (const distro of result.DistributionList?.Items || []) {
    const r = await cloudfront
      .listTagsForResource({
        Resource: distro.ARN,
      })
      .promise();
    for (const tag of r.Tags.Items || []) {
      if (tag.Key === "SeaSketchDataSource" && tag.Value === id) {
        return {
          arn: distro.ARN,
          location: distro.DomainName,
          id: distro.Id,
        };
      }
    }
  }
  throw new Error(`Could not find Cloudfront distribution for ${id}`);
}

/**
 * Schedules old version of the given DataSource for deletion by creating new
 * Lifecycle Rules on the bucket. Objects will be deleted after 24 hours in
 * order to prevent disruption of DataSource use by existing clients.
 * In order to prevent Lifecycle Rules from constantly piling up, rules that are
 * more that 48 hours old will be deleted.
 *
 * @export
 * @param {string} dataSourceName
 * @param {number} version
 * @param {Date} lastPublished
 */
export async function scheduleObjectsForDeletion(
  dataSourceName: string,
  version: number,
  lastPublished: Date
) {
  const lastPublishedDaysAgo = Math.round(
    (new Date().getTime() - new Date(lastPublished).getTime()) /
      1000 /
      60 /
      60 /
      24
  );

  let Rules: LifecycleRules | undefined;
  // get lifecycle rules
  try {
    ({ Rules } = await s3
      .getBucketLifecycleConfiguration({
        Bucket: bucketName(dataSourceName),
      })
      .promise());
    // Delete existing rules that are too old
    if (Rules) {
      Rules = Rules?.filter((Rule) => {
        if (Rule.Expiration && Rule.Expiration.Date) {
          // Keep rules around 24 hours after their expiration date to make sure
          // they execute
          return (
            new Date().getTime() - Rule.Expiration.Date.getTime() <
            1000 * 60 * 60 * 24
          );
        } else {
          return true;
        }
      });
    } else {
      Rules = [];
    }
  } catch (e) {
    Rules = [];
  }
  const midnight = new Date();
  midnight.setUTCHours(48, 0, 0);
  Rules.push({
    Expiration: {
      Date: midnight,
    },
    Status: "Enabled",
    Filter: {
      Prefix: `${version}/`,
    },
    ID: `delete-${version}`,
  });
  await s3
    .putBucketLifecycleConfiguration({
      Bucket: bucketName(dataSourceName),
      LifecycleConfiguration: {
        Rules: Rules,
      },
    })
    .promise();
  return midnight;
}

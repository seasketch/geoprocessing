import fs from "fs";
import AWS from "aws-sdk";
import { Manifest } from "../manifest";
import path from "path";

const PROJECT_PATH = process.env.PROJECT_PATH;
if (!PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const buildPath = path.join(PROJECT_PATH, `.build`);

const manifest = JSON.parse(
  fs.readFileSync(`${buildPath}/manifest.json`).toString()
) as Manifest;
if (!manifest) throw new Error(`Missing manifest in ${buildPath}`);

const bucket = `gp-${manifest.title}-client`;
const indexPath = bucket + "/index.html";

console.log(`Setting CacheControl for bucket ${bucket}`);

const s3 = new AWS.S3({ region: manifest.region });
s3.copyObject(
  {
    Bucket: bucket,
    CopySource: `/${bucket}/index.html`,
    Key: "index.html",
    ACL: "public-read",
    CacheControl: "max-age=10, stale-while-revalidate=3600",
    ContentType: "text/html",
    MetadataDirective: "REPLACE",
  },
  (err, data) => {
    if (err) {
      throw err;
    } else {
      // console.log("updated cache-control header on " + indexPath);
      process.exit();
    }
  }
);

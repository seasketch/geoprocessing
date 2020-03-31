const fs = require("fs");
const AWS = require("aws-sdk");

const pkg = JSON.parse(
  fs.readFileSync(`${process.env.PROJECT_PATH}/package.json`).toString()
);
const geo = JSON.parse(
  fs.readFileSync(`${process.env.PROJECT_PATH}/geoprocessing.json`).toString()
);

const project = pkg.name;
const region = geo.region;

const s3 = new AWS.S3({ region: region });

const bucket = `${project}-client-${region}`;
const path = bucket + "/index.html";

s3.copyObject(
  {
    Bucket: bucket,
    CopySource: `/${bucket}/index.html`,
    Key: "index.html",
    ACL: "public-read",
    CacheControl: "max-age=1, stale-while-revalidate=3600",
    ContentType: "text/html",
    MetadataDirective: "REPLACE"
  },
  (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log("updated cache-control header on " + path);
      process.exit();
    }
  }
);

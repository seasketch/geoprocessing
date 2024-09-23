import fs from "fs";
import path from "path";
import { CloudFormation } from "@aws-sdk/client-cloudformation";
const PROJECT_PATH = process.env.PROJECT_PATH;
if (!PROJECT_PATH) {
  throw new Error("process.env.PROJECT_PATH not defined");
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString(),
);
const packageName = pkg.name;
const geoprocessing = JSON.parse(
  fs
    .readFileSync(path.join(PROJECT_PATH, "project", "geoprocessing.json"))
    .toString(),
);
const cf = new CloudFormation({
  region: geoprocessing.region,
});

cf.describeStacks({ StackName: `gp-${packageName}` }, (err, data) => {
  if (err) {
    throw err;
  }
  if (!data) {
    throw new Error("No data returned from describeStacks");
  }
  if (!data.Stacks || !data.Stacks.length) {
    throw new Error(`No stack named gp-${packageName}`);
  }

  const Outputs = data.Stacks[0].Outputs;
  if (!Outputs) {
    throw new Error("Missing outputs");
  }

  console.log(
    `REST service URL:    ${
      Outputs.find((o) => /restApiUrl/.test(o.OutputKey || ""))?.OutputValue
    }`,
  );
  console.log(
    `Web socket URL:      ${
      Outputs.find((o) => /socketApiUrl/.test(o.OutputKey || ""))?.OutputValue
    }`,
  );
  console.log(
    `Dataset bucket:      ${
      Outputs.find((o) => /datasetBucketUrl/.test(o.OutputKey || ""))
        ?.OutputValue
    }`,
  );
  console.log(
    `Result bucket:       ${
      Outputs.find((o) => /resultBucketUrl/.test(o.OutputKey || ""))
        ?.OutputValue
    }`,
  );

  process.exit();
});

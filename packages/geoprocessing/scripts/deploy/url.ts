import fs from "fs";
import path from "path";
import { CloudFormation } from "aws-sdk";
const PROJECT_PATH = process.env.PROJECT_PATH;
if (!PROJECT_PATH) {
  throw new Error("process.env.PROJECT_PATH not defined");
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
);
const packageName = pkg.name;
const geoprocessing = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
);
const cf = new CloudFormation({ region: geoprocessing.region });

cf.describeStacks({ StackName: `gp-${packageName}` }, (err, data) => {
  if (err) {
    throw err;
  }
  if (!data.Stacks || !data.Stacks.length) {
    throw new Error(`No stack named gp-${packageName}`);
  }
  const Outputs = data.Stacks[0].Outputs;
  const output = Outputs?.find((o) => /apiEndpoint/.test(o.OutputKey || ""));
  if (!output) {
    throw new Error("Could not find output named ProjectRoot");
  }
  console.log(output.OutputValue);
  process.exit();
});

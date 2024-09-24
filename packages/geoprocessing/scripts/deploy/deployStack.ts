import fs from "fs";
import path from "path";
import { App, Tags } from "aws-cdk-lib";
import { Manifest, ProcessingFunctionMetadata } from "../manifest.js";
import { GeoprocessingStack } from "../aws/GeoprocessingStack.js";
import { CloudFormation } from "@aws-sdk/client-cloudformation";

if (!process.env.PROJECT_PATH) {
  throw new Error("PROJECT_PATH env var not specified");
}

const PROJECT_PATH = process.env.PROJECT_PATH;

const pkg = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString(),
);
const packageName = pkg.name;

const manifest: Manifest = JSON.parse(
  fs
    .readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json"))
    .toString(),
);

const geoprocessing = JSON.parse(
  fs
    .readFileSync(path.join(PROJECT_PATH, "project", "geoprocessing.json"))
    .toString(),
);

const cf = new CloudFormation({
  region: geoprocessing.region,
});

export async function deployStack() {
  let functionGroups: string[][] = [];
  let workerGroups: string[][] = [];

  try {
    const describeOutputs = await cf.describeStacks({
      StackName: `gp-${packageName}`,
    });

    if (describeOutputs.Stacks && describeOutputs.Stacks[0].Outputs) {
      const Outputs = describeOutputs.Stacks[0].Outputs;

      const functionGroupsJson = Outputs.find(
        (o) => o.OutputKey === "functionGroups",
      )?.OutputValue;
      const workerGroupsJson = Outputs.find(
        (o) => o.OutputKey === "workeerGroups",
      )?.OutputValue;

      if (functionGroupsJson && functionGroupsJson.length > 0) {
        functionGroups = JSON.parse(functionGroupsJson);
      }
      if (workerGroupsJson && workerGroupsJson.length > 0) {
        workerGroups = JSON.parse(workerGroupsJson);
      }
    }
  } catch (err) {
    // stack doesn't exist, keep going
  }

  const app = new App();
  const stack = new GeoprocessingStack(app, `gp-${manifest.title}`, {
    env: { region: manifest.region },
    projectName: manifest.title,
    manifest,
    projectPath: PROJECT_PATH,
    functionGroups,
    workerGroups,
  });
  Tags.of(stack).add("Author", manifest.author);
  Tags.of(stack).add("Cost Center", "seasketch-geoprocessing");
  Tags.of(stack).add("Geoprocessing Project", manifest.title);
}

deployStack();

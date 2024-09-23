import fs from "fs";
import path from "path";
import { App, Tags } from "aws-cdk-lib";
import { Manifest } from "../manifest.js";
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
  const describeOutputs = await cf.describeStacks({
    StackName: `gp-${packageName}`,
  });

  if (describeOutputs.Stacks && describeOutputs.Stacks[0].Outputs) {
    const Outputs = describeOutputs.Stacks[0].Outputs;
    const lambdaStackList = Outputs.find(
      (o) => o.OutputKey === "lambdaStackList",
    )?.OutputValue;
  }

  const app = new App();
  const stack = new GeoprocessingStack(app, `gp-${manifest.title}`, {
    env: { region: manifest.region },
    projectName: manifest.title,
    manifest,
    projectPath: PROJECT_PATH,
  });
  Tags.of(stack).add("Author", manifest.author);
  Tags.of(stack).add("Cost Center", "seasketch-geoprocessing");
  Tags.of(stack).add("Geoprocessing Project", manifest.title);
}

deployStack();

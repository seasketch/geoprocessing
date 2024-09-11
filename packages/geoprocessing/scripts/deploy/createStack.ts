import fs from "fs";
import path from "path";
import { App, Tags } from "aws-cdk-lib";
import { Manifest } from "../manifest.js";
import { GeoprocessingStack } from "../aws/GeoprocessingStack.js";

if (!process.env.PROJECT_PATH) {
  throw new Error("PROJECT_PATH env var not specified");
}

const PROJECT_PATH = process.env.PROJECT_PATH;

const manifest: Manifest = JSON.parse(
  fs
    .readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json"))
    .toString(),
);

export async function createStack() {
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
createStack();

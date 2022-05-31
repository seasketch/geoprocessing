import * as core from "@aws-cdk/core";
import fs from "fs";
import path from "path";
import { Manifest } from "../manifest";
import GeoprocessingCdkStack from "../aws/GeoprocessingStackV1";

if (!process.env.PROJECT_PATH) {
  throw new Error("PROJECT_PATH env var not specified");
}

const PROJECT_PATH = process.env.PROJECT_PATH;

const manifest: Manifest = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json")).toString()
);

export async function createStack() {
  const app = new core.App();
  const stack = new GeoprocessingCdkStack(app, `gp-${manifest.title}`, {
    env: { region: manifest.region },
    projectName: manifest.title,
    manifest,
    projectPath: PROJECT_PATH,
  });
  core.Tags.of(stack).add("Author", manifest.author);
  core.Tags.of(stack).add("Cost Center", "seasketch-geoprocessing");
  core.Tags.of(stack).add("Geoprocessing Project", manifest.title);
}
createStack();

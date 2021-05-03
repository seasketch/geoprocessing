import * as core from "@aws-cdk/core";
import fs from "fs";
import path from "path";
import { Manifest } from "../manifest";
import slugify from "slugify";
import GeoprocessingCdkStack from "../aws/GeoprocessingStack";

if (!process.env.PROJECT_PATH) {
  throw new Error("PROJECT_PATH env var not specified");
}

const PROJECT_PATH = process.env.PROJECT_PATH;

const manifest: Manifest = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json")).toString()
);

export async function createStack() {
  const projectName = slugify(
    manifest.title.replace(/@/g, "").replace("/", "-")
  ); // assumed to be lowercase string from init but not guaranteed
  const projectAuthor = slugify(manifest.author.replace(/\<.*\>/, ""));
  const stackName = `${projectName}-geoprocessing-stack`;

  const app = new core.App();
  const stack = new GeoprocessingCdkStack(app, stackName, {
    env: { region: manifest.region },
    projectName,
    manifest,
    projectPath: PROJECT_PATH,
  });
  core.Tags.of(stack).add("Author", projectAuthor);
  core.Tags.of(stack).add("Cost Center", "seasketch-geoprocessing");
  core.Tags.of(stack).add("Geoprocessing Project", projectName);
}
createStack();

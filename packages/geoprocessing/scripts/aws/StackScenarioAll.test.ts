/**
 * @group aws
 */

import * as core from "@aws-cdk/core";
import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import GeoprocessingStack from "./GeoprocessingStack";
import createTestProject from "./createTestProject";
import fs from "fs-extra";

const projectName = "all";
const rootPath = `${__dirname}/__test__`;
const projectPath = path.join(rootPath, projectName);

afterAll(async () => {
  await fs.remove(rootPath); // Cleanup
});

test("gp-stack-scenario-all", async () => {
  // Stub out code asset sources expected by CDK
  await fs.ensureDir(path.join(projectPath, ".build"));
  await fs.ensureDir(path.join(projectPath, ".build-web"));

  const manifest = await createTestProject(projectName, [
    "preprocessor",
    "syncGeoprocessor",
    "asyncGeoprocessor",
    "client",
  ]);

  const app = new core.App();
  const stack = new GeoprocessingStack(app, projectName, {
    env: { region: manifest.region },
    projectName,
    manifest,
    projectPath,
  });

  expect(stack).toBeTruthy();
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

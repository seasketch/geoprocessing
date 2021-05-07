import * as core from "@aws-cdk/core";
import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import "@aws-cdk/assert/jest";
import GeoprocessingStack from "./GeoprocessingStack";
import createTestProject from "../testing/createTestProject";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle";

const rootPath = `${__dirname}/__test__`;

describe("GeoprocessingStack - all components", () => {
  afterAll(() => cleanupBuildDirs(rootPath));

  it("should create a valid stack", async () => {
    const projectName = "all";
    const projectPath = path.join(rootPath, projectName);
    await setupBuildDirs(projectPath);

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
});

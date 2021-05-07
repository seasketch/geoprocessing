import * as core from "@aws-cdk/core";
import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import "@aws-cdk/assert/jest";
import GeoprocessingStack from "./GeoprocessingStack";
import createTestProject from "../testing/createTestProject";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle";

const rootPath = `${__dirname}/__test__`;

describe("GeoprocessingStack - client only", () => {
  afterAll(() => cleanupBuildDirs(rootPath));

  it.only("should create a valid stack", async () => {
    const projectName = "client-only";
    const projectPath = path.join(rootPath, projectName);
    await setupBuildDirs(projectPath);

    const manifest = await createTestProject(projectName, ["client"]);
    const app = new core.App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    const assembly = SynthUtils.synthesize(stack);
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
    expect(stack).toCountResources("AWS::S3::Bucket", 2);
    expect(stack).toCountResources("AWS::ApiGateway::Method", 2);
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `${projectName}-client-us-west-1`,
    });
  });
});

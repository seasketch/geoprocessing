import { App } from "aws-cdk-lib";
import "@aws-cdk/assert/jest";
import { GeoprocessingStack } from "./GeoprocessingStack.js";
import config from "./config.js";
import createTestProjectManifest from "../testing/createTestProjectManifest.js";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle.js";
import path from "node:path";
import { describe, it, expect, afterAll } from "vitest";

const rootPath = `${import.meta.dirname}/../__test__`;
const projectName = "client-only";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - client only", () => {
  afterAll(() => cleanupBuildDirs(projectPath));

  it.skip("should create a valid stack", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestProjectManifest(projectName, ["client"]);

    expect(manifest.clients.length).toBe(1);
    expect(manifest.preprocessingFunctions.length).toBe(0);
    expect(manifest.geoprocessingFunctions.length).toBe(0);

    const app = new App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    // Check counts
    expect(stack.hasClients()).toEqual(true);
    expect(stack.hasSyncFunctions()).toEqual(false);
    expect(stack.hasAsyncFunctions()).toEqual(false);
    expect(stack.getSyncFunctionMetas().length).toBe(0);
    expect(stack.getAsyncFunctionMetas().length).toBe(0);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(0);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(0);

    // expect(stack).toCountResources("AWS::CloudFront::Distribution", 1); // shared
    // expect(stack).toCountResources("AWS::S3::Bucket", 2);
    // expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    // expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    // expect(stack).toCountResources("AWS::ApiGatewayV2::Api", 0); // web socket api
    // expect(stack).toCountResources("AWS::ApiGatewayV2::Stage", 0);
    // expect(stack).toCountResources("AWS::DynamoDB::Table", 0);
    // expect(stack).toCountResources("AWS::Lambda::Function", 3); //metadataHandler, client bucket deploy, bucket delete

    // expect(stack).toHaveResourceLike("AWS::ApiGateway::Stage", {
    //   StageName: config.STAGE_NAME,
    // });

    // // Check shared resources
    // expect(stack).toHaveResourceLike("AWS::ApiGateway::RestApi", {
    //   Name: `gp-${projectName}`,
    // });
    // expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
    //   BucketName: `gp-${projectName}-datasets`,
    // });
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   Handler: "serviceHandlers.projectMetadata",
    //   Runtime: config.NODE_RUNTIME.name,
    // });

    // // Check client resources
    // expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
    //   BucketName: `gp-${projectName}-client`,
    // });
  });
});

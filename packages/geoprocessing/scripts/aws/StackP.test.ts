/**
 * @group scripts/cdk
 */

import { App } from "aws-cdk-lib";
import "@aws-cdk/assert/jest";
import { GeoprocessingStack, getHandlerPointer } from "./GeoprocessingStack.js";
import config from "./config.js";
import createTestProjectManifest from "../testing/createTestProjectManifest.js";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootPath = `${__dirname}/../__test__`;
const projectName = "preprocessor-only";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - preprocessor only", () => {
  afterAll(() => cleanupBuildDirs(projectPath));

  it.only("should create a valid stack", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestProjectManifest(projectName, [
      "preprocessor",
    ]);

    expect(manifest.clients.length).toBe(0);
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.geoprocessingFunctions.length).toBe(0);

    const app = new App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    // Check counts
    expect(stack.hasClients()).toEqual(false);
    expect(stack.hasSyncFunctions()).toEqual(true);
    expect(stack.hasAsyncFunctions()).toEqual(false);
    expect(stack.getSyncFunctionMetas().length).toBe(1);
    expect(stack.getAsyncFunctionMetas().length).toBe(0);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(1);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(0);

    // expect(stack).toCountResources("AWS::CloudFront::Distribution", 0);
    // expect(stack).toCountResources("AWS::S3::Bucket", 2);
    // expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    // expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    // expect(stack).toCountResources("AWS::ApiGatewayV2::Api", 0); // web socket api
    // expect(stack).toCountResources("AWS::ApiGatewayV2::Stage", 0);
    // expect(stack).toCountResources("AWS::DynamoDB::Table", 2);
    // expect(stack).toCountResources("AWS::Lambda::Function", 3);

    // expect(stack).toHaveResourceLike("AWS::ApiGateway::Stage", {
    //   StageName: config.STAGE_NAME,
    // });

    // // Check shared resources
    // expect(stack).toHaveResourceLike("AWS::ApiGateway::RestApi", {
    //   Name: `gp-${projectName}`,
    // });
    // expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
    //   BucketName: `gp-${projectName}-results`,
    // });
    // expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
    //   BucketName: `gp-${projectName}-datasets`,
    // });
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   Handler: "serviceHandlers.projectMetadata",
    //   Runtime: config.NODE_RUNTIME.name,
    // });
    // expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
    //   TableName: `gp-${projectName}-tasks`,
    // });
    // expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
    //   TableName: `gp-${projectName}-estimates`,
    // });

    // // Check preprocessor resources
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-sync-${manifest.preprocessingFunctions[0].title}`,
    //   Handler: getHandlerPointer(manifest.preprocessingFunctions[0]),
    //   Runtime: config.NODE_RUNTIME.name,
    // });
  });
});

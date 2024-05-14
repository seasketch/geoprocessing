/**
 * @group scripts/cdk
 */

import { App } from "aws-cdk-lib";
import { SynthUtils } from "@aws-cdk/assert";
import "@aws-cdk/assert/jest";
import createTestProjectManifest from "../testing/createTestProjectManifest.js";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle.js";
import { GeoprocessingStack, getHandlerPointer } from "./GeoprocessingStack.js";
import config from "./config.js";
import path from "node:path";
import { describe, test, expect, afterAll } from "vitest"

const rootPath = `${import.meta.dirname}/../__test__`;
const projectName = "all";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - all components", () => {
  afterAll(() => cleanupBuildDirs(projectPath));

  test.skip("should create a valid stack", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestProjectManifest(projectName, [
      "preprocessor",
      "syncGeoprocessor",
      "asyncGeoprocessor",
      "client",
    ]);

    expect(manifest.clients.length).toBe(1);
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.geoprocessingFunctions.length).toBe(2);

    const app = new App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    expect(stack).toBeTruthy();
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();

    // Check counts
    // expect(stack).toCountResources("AWS::CloudFront::Distribution", 1);
    // expect(stack).toCountResources("AWS::S3::Bucket", 3);
    // expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    // expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    // expect(stack).toCountResources("AWS::ApiGateway::Method", 10); // root (get, options), async (get, post, options), preprocessor (options, post), sync (get, post, options)
    // expect(stack).toCountResources("AWS::ApiGatewayV2::Api", 1); // web socket api
    // expect(stack).toCountResources("AWS::ApiGatewayV2::Stage", 1);
    // expect(stack).toCountResources("AWS::ApiGatewayV2::Route", 4);
    // expect(stack).toCountResources("AWS::DynamoDB::Table", 3);
    // expect(stack).toCountResources("AWS::Lambda::Function", 10);

    // expect(stack).toHaveResourceLike("AWS::ApiGateway::Stage", {
    //   StageName: config.STAGE_NAME,
    // });

    // Check shared resources
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

    // // Check shared async resources
    // expect(stack).toHaveResourceLike("AWS::ApiGatewayV2::Api", {
    //   ProtocolType: "WEBSOCKET",
    //   Name: `gp-${projectName}-socket`,
    // });
    // expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
    //   TableName: `gp-${projectName}-subscriptions`,
    // });
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-subscribe`,
    //   Handler: "connect.connectHandler",
    //   Runtime: config.NODE_RUNTIME.name,
    // });
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-unsubscribe`,
    //   Handler: "disconnect.disconnectHandler",
    //   Runtime: config.NODE_RUNTIME.name,
    // });
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-send`,
    //   Handler: "sendmessage.sendHandler",
    //   Runtime: config.NODE_RUNTIME.name,
    // });

    // // Check client resources
    // expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
    //   BucketName: `gp-${projectName}-client`,
    // });

    // // Check preprocessor resources
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-sync-${manifest.preprocessingFunctions[0].title}`,
    //   Handler: getHandlerPointer(manifest.preprocessingFunctions[0]),
    //   Runtime: config.NODE_RUNTIME.name,
    // });

    // // Check sync geoprocessing function resources
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-sync-${manifest.geoprocessingFunctions[0].title}`,
    //   Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
    //   Runtime: config.NODE_RUNTIME.name,
    // });

    // // Check async function resources
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-start`,
    //   Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
    //   Runtime: config.NODE_RUNTIME.name,
    // });
    // expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    //   FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-run`,
    //   Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
    //   Runtime: config.NODE_RUNTIME.name,
    // });
  });
});

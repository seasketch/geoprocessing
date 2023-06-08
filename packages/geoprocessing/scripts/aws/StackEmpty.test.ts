/**
 * @group scripts/cdk
 */

import { App } from "aws-cdk-lib";
import path from "path";
import "@aws-cdk/assert/jest";
import { GeoprocessingStack } from "./GeoprocessingStack";
import config from "./config";
import createTestProjectManifest from "../testing/createTestProjectManifest";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle";

const rootPath = `${__dirname}/__test__`;
const projectName = "empty";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - empty", () => {
  afterAll(() => cleanupBuildDirs(projectPath));

  it.only("should create a valid stack", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestProjectManifest(projectName, []);

    expect(manifest.clients.length).toBe(0);
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
    expect(stack.hasClients()).toEqual(false);
    expect(stack.hasSyncFunctions()).toEqual(false);
    expect(stack.hasAsyncFunctions()).toEqual(false);
    expect(stack.getSyncFunctionMetas().length).toBe(0);
    expect(stack.getAsyncFunctionMetas().length).toBe(0);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(0);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(0);

    expect(stack).toCountResources("AWS::CloudFront::Distribution", 0);
    expect(stack).toCountResources("AWS::S3::Bucket", 1); // dataset bucket
    expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1); // metadata root route
    expect(stack).toCountResources("AWS::ApiGateway::Stage", 1); // rest api
    expect(stack).toCountResources("AWS::ApiGatewayV2::Api", 0); // metadata root route
    expect(stack).toCountResources("AWS::ApiGatewayV2::Stage", 0); // web socket api
    expect(stack).toCountResources("AWS::DynamoDB::Table", 0);
    expect(stack).toCountResources("AWS::Lambda::Function", 2); // metadata root and bucket auto-delete

    expect(stack).toHaveResourceLike("AWS::ApiGateway::Stage", {
      StageName: config.STAGE_NAME,
    });

    // Check shared resources
    expect(stack).toHaveResourceLike("AWS::ApiGateway::RestApi", {
      Name: `gp-${projectName}`,
    });
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-datasets`,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      Handler: "serviceHandlers.projectMetadata",
      Runtime: config.NODE_RUNTIME.name,
    });
  });
});

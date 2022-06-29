import { App } from "aws-cdk-lib";
import path from "path";
import "@aws-cdk/assert/jest";
import { GeoprocessingStack, getHandlerPointer } from "./GeoprocessingStack";
import config from "./config";
import createTestProjectManifest from "../testing/createTestProjectManifest";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle";

const rootPath = `${__dirname}/__test__`;

describe("GeoprocessingStack - async geoprocessor only", () => {
  afterAll(() => cleanupBuildDirs(rootPath));

  it.only("should create a valid stack", async () => {
    const projectName = "async-geoprocessor-only";
    const projectPath = path.join(rootPath, projectName);
    await setupBuildDirs(projectPath);

    const manifest = await createTestProjectManifest(projectName, [
      "asyncGeoprocessor",
    ]);

    expect(manifest.clients.length).toBe(0);
    expect(manifest.preprocessingFunctions.length).toBe(0);
    expect(manifest.geoprocessingFunctions.length).toBe(1);

    const app = new App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    // Check counts
    expect(stack).toCountResources("AWS::CloudFront::Distribution", 0);
    expect(stack).toCountResources("AWS::S3::Bucket", 2);
    expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    expect(stack).toCountResources("AWS::DynamoDB::Table", 3);
    expect(stack).toCountResources("AWS::Lambda::Function", 7);

    expect(stack).toHaveResourceLike("AWS::ApiGateway::Stage", {
      StageName: config.STAGE_NAME,
    });

    // Check shared resources
    expect(stack).toHaveResourceLike("AWS::ApiGateway::RestApi", {
      Name: `gp-${projectName}`,
    });
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-results`,
    });
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-datasets`,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      Handler: "serviceHandlers.projectMetadata",
      Runtime: config.NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-tasks`,
    });
    expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-estimates`,
    });

    // Check shared async resources
    expect(stack).toHaveResourceLike("AWS::ApiGatewayV2::Api", {
      ProtocolType: "WEBSOCKET",
      Name: `gp-${projectName}-socket`,
    });
    expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-subscriptions`,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-subscribe`,
      Handler: "connect.connectHandler",
      Runtime: config.NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-unsubscribe`,
      Handler: "disconnect.disconnectHandler",
      Runtime: config.NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-send`,
      Handler: "sendmessage.sendHandler",
      Runtime: config.NODE_RUNTIME.name,
    });

    // Check async function resources
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[0].title}-start`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[0].title}-run`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });
  });
});

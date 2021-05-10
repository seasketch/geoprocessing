import * as core from "@aws-cdk/core";
import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import "@aws-cdk/assert/jest";
import GeoprocessingStack, {
  STAGE_NAME,
  NODE_RUNTIME,
} from "./GeoprocessingStack";
import createTestProject from "../testing/createTestProject";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle";
import { getHandlerFilename } from "../manifest";

const rootPath = `${__dirname}/__test__`;

describe("GeoprocessingStack - async geoprocessor only", () => {
  afterAll(() => cleanupBuildDirs(rootPath));

  it.only("should create a valid stack", async () => {
    const projectName = "async-geoprocessor-only";
    const projectPath = path.join(rootPath, projectName);
    await setupBuildDirs(projectPath);

    const manifest = await createTestProject(projectName, [
      "asyncGeoprocessor",
    ]);

    expect(manifest.clients.length).toBe(0);
    expect(manifest.preprocessingFunctions.length).toBe(0);
    expect(manifest.geoprocessingFunctions.length).toBe(1);

    const app = new core.App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    // Check counts
    expect(stack).toCountResources("AWS::CloudFront::Distribution", 0);
    expect(stack).toCountResources("AWS::S3::Bucket", 1);
    expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    expect(stack).toCountResources("AWS::DynamoDB::Table", 3);
    expect(stack).toCountResources("AWS::Lambda::Function", 6);

    expect(stack).toHaveResourceLike("AWS::ApiGateway::Stage", {
      StageName: STAGE_NAME,
    });

    // Check shared resources
    expect(stack).toHaveResourceLike("AWS::ApiGateway::RestApi", {
      Name: `gp-${projectName}`,
    });
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-public`,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      Handler: "serviceHandlers.projectMetadata",
      Runtime: NODE_RUNTIME.name,
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
      Runtime: NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-unsubscribe`,
      Handler: "disconnect.disconnectHandler",
      Runtime: NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-send`,
      Handler: "sendmessage.sendHandler",
      Runtime: NODE_RUNTIME.name,
    });

    // Check async function resources
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[0].title}-start`,
      Handler: getHandlerFilename(manifest.geoprocessingFunctions[0]),
      Runtime: NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[0].title}-run`,
      Handler: getHandlerFilename(manifest.geoprocessingFunctions[0]),
      Runtime: NODE_RUNTIME.name,
    });
  });
});

import * as core from "@aws-cdk/core";
import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import "@aws-cdk/assert/jest";
import createTestProject from "../testing/createTestProject";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle";
import GeoprocessingStack, {
  STAGE_NAME,
  NODE_RUNTIME,
  getHandlerPointer,
} from "./GeoprocessingStack";

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

    expect(manifest.clients.length).toBe(1);
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.geoprocessingFunctions.length).toBe(2);

    const app = new core.App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    expect(stack).toBeTruthy();
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();

    // Check counts
    expect(stack).toCountResources("AWS::CloudFront::Distribution", 1);
    expect(stack).toCountResources("AWS::S3::Bucket", 2);
    expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    expect(stack).toCountResources("AWS::DynamoDB::Table", 3);
    expect(stack).toCountResources("AWS::Lambda::Function", 10);

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

    // Check client resources
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-client`,
    });

    // Check preprocessor resources
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.preprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.preprocessingFunctions[0]),
      Runtime: NODE_RUNTIME.name,
    });

    // Check sync geoprocessing function resources
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.geoprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
      Runtime: NODE_RUNTIME.name,
    });

    // Check async function resources
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-start`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
      Runtime: NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-run`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
      Runtime: NODE_RUNTIME.name,
    });
  });
});

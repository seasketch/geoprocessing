import * as core from "@aws-cdk/core";
import path from "path";
import "@aws-cdk/assert/jest";
import GeoprocessingStack, {
  STAGE_NAME,
  NODE_RUNTIME,
} from "./GeoprocessingStack";
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

    expect(manifest.clients.length).toBe(1);
    expect(manifest.preprocessingFunctions.length).toBe(0);
    expect(manifest.geoprocessingFunctions.length).toBe(0);

    const app = new core.App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    // Check counts
    expect(stack).toCountResources("AWS::CloudFront::Distribution", 1); // shared
    expect(stack).toCountResources("AWS::S3::Bucket", 2);
    expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    expect(stack).toCountResources("AWS::DynamoDB::Table", 2);
    expect(stack).toCountResources("AWS::Lambda::Function", 3); //metadataHandler, bucket sync

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
  });
});

import { App } from "aws-cdk-lib";
import "@aws-cdk/assert/jest";
import { GeoprocessingStack, getHandlerPointer } from "./GeoprocessingStack.js";
import config from "./config.js";
import createTestProjectManifest from "../testing/createTestProjectManifest.js";
import { cleanupBuildDirs } from "../testing/lifecycle.js";
import path from "node:path";
import { describe, it, expect, afterAll } from "vitest";
import { Template } from "aws-cdk-lib/assertions";
import createTestBuild from "../testing/createTestBuild.js";

const rootPath = `${import.meta.dirname}/../__test__`;
const projectName = "preprocessor-only";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - preprocessor only", () => {
  // afterAll(() => cleanupBuildDirs(projectPath));

  it.skip("should create a valid stack", async () => {
    const manifest = await createTestBuild(projectName, projectPath, [
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

    const template = Template.fromStack(stack);

    // Check counts
    expect(stack.hasClients()).toEqual(false);
    expect(stack.hasSyncFunctions()).toEqual(true);
    expect(stack.hasAsyncFunctions()).toEqual(false);
    expect(stack.getSyncFunctionMetas().length).toBe(1);
    expect(stack.getAsyncFunctionMetas().length).toBe(0);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(1);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(0);

    template.resourceCountIs("AWS::CloudFront::Distribution", 0);
    template.resourceCountIs("AWS::S3::Bucket", 2);
    template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
    template.resourceCountIs("AWS::ApiGateway::Stage", 1);
    template.resourceCountIs("AWS::ApiGatewayV2::Api", 0); // web socket api
    template.resourceCountIs("AWS::ApiGatewayV2::Stage", 0);
    template.resourceCountIs("AWS::DynamoDB::Table", 2);
    template.resourceCountIs("AWS::Lambda::Function", 3);

    template.hasResourceProperties("Foo::Bar", {
      Lorem: "Ipsum",
      Baz: 5,
      Qux: ["Waldo", "Fred"],
    });

    template.allResourcesProperties("AWS::ApiGateway::Stage", {
      StageName: config.STAGE_NAME,
    });

    // // Check shared resources
    template.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Name: `gp-${projectName}`,
    });
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-results`,
    });
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-datasets`,
    });
    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "serviceHandlers.projectMetadata",
      Runtime: config.NODE_RUNTIME.name,
    });
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-tasks`,
    });
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-estimates`,
    });

    // // Check preprocessor resources
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.preprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.preprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });
  });
});

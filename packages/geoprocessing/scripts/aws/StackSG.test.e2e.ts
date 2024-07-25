import { App, NestedStack } from "aws-cdk-lib";
import { GeoprocessingStack, getHandlerPointer } from "./GeoprocessingStack.js";
import config from "./config.js";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle.js";
import path from "node:path";
import { describe, it, expect, afterAll } from "vitest";
import { Template } from "aws-cdk-lib/assertions";
import fs from "fs-extra";
import createTestBuild from "../testing/createTestBuild.js";

const rootPath = `${import.meta.dirname}/../__test__`;
const projectName = "sync-geoprocessor-only";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - sync geoprocessor only", () => {
  afterAll(() => cleanupBuildDirs(projectPath));

  it("should create a valid stack", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestBuild(projectName, projectPath, [
      "syncGeoprocessor",
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

    const rootTemplate = Template.fromStack(stack);

    // Lambda stack assertions

    const lambdaStacks = stack.node.children.filter(
      (child) => child instanceof NestedStack
    );
    expect(lambdaStacks.length).toBe(1);

    // Lambda stack CDK template assertions

    const lambdaStackTemplate = Template.fromStack(
      lambdaStacks[0] as NestedStack
    );

    // Generate JSON snapshot.  Use to manually assess what cdk synth produces and write tests
    // Does not currently enforce matching with toMatchSnapshot() because dynamic values like S3Key are not consistent

    const snapPath = "./scripts/aws/__snapshots__/";
    fs.ensureDirSync(snapPath);
    fs.writeJSONSync(
      `${snapPath}/StackSG_rootStack.test.e2e.ts.snap`,
      rootTemplate.toJSON(),
      {
        spaces: 2,
      }
    );
    fs.writeJSONSync(
      `${snapPath}/StackSG_lambdaStack.test.e2e.ts.snap`,
      lambdaStackTemplate.toJSON(),
      {
        spaces: 2,
      }
    );

    // Root stack assertions

    expect(stack.hasClients()).toEqual(false);
    expect(stack.hasSyncFunctions()).toEqual(true);
    expect(stack.hasAsyncFunctions()).toEqual(false);
    expect(stack.getSyncFunctionMetas().length).toBe(1);
    expect(stack.getAsyncFunctionMetas().length).toBe(0);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(1);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(0);

    rootTemplate.resourceCountIs("AWS::CloudFront::Distribution", 0);
    rootTemplate.resourceCountIs("AWS::S3::Bucket", 2);
    rootTemplate.resourceCountIs("AWS::ApiGateway::RestApi", 1);
    rootTemplate.resourceCountIs("AWS::ApiGateway::Stage", 1);
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Api", 0); // web socket api
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Stage", 0);
    rootTemplate.resourceCountIs("AWS::DynamoDB::Table", 2);
    rootTemplate.resourceCountIs("AWS::Lambda::Function", 2);

    rootTemplate.allResourcesProperties("AWS::ApiGateway::Stage", {
      StageName: config.STAGE_NAME,
    });

    // Check shared resources
    rootTemplate.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Name: `gp-${projectName}`,
    });
    rootTemplate.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-results`,
    });
    rootTemplate.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-datasets`,
    });
    rootTemplate.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "serviceHandlers.projectMetadata",
      Runtime: config.NODE_RUNTIME.name,
    });
    rootTemplate.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-tasks`,
    });
    rootTemplate.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-estimates`,
    });

    // Check sync function resources
    lambdaStackTemplate.resourceCountIs("AWS::Lambda::Function", 1);

    lambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.geoprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });
  }, 30000);
});

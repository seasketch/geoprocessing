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
const projectName = "all";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - all components", () => {
  afterAll(() => cleanupBuildDirs(projectPath));

  test("should create a valid stack", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestBuild(projectName, projectPath, [
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
      `${snapPath}/StackAll_rootStack.test.e2e.ts.snap`,
      rootTemplate.toJSON(),
      {
        spaces: 2,
      }
    );
    fs.writeJSONSync(
      `${snapPath}/StackAll_lambdaStack.test.e2e.ts.snap`,
      lambdaStackTemplate.toJSON(),
      {
        spaces: 2,
      }
    );

    // Root stack assertions

    expect(stack.hasClients()).toEqual(true);
    expect(stack.hasSyncFunctions()).toEqual(true);
    expect(stack.hasAsyncFunctions()).toEqual(true);
    expect(stack.getSyncFunctionMetas().length).toBe(2);
    expect(stack.getAsyncFunctionMetas().length).toBe(1);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(2);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(1);

    rootTemplate.resourceCountIs("AWS::CloudFront::Distribution", 1);
    rootTemplate.resourceCountIs("AWS::S3::Bucket", 3);
    rootTemplate.resourceCountIs("AWS::ApiGateway::RestApi", 1);
    rootTemplate.resourceCountIs("AWS::ApiGateway::Stage", 1);
    rootTemplate.resourceCountIs("AWS::ApiGateway::Method", 10); // root (get, options), async (get, post, options), preprocessor (options, post), sync (get, post, options)
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Api", 1); // web socket api
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Stage", 1);
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Route", 4);
    rootTemplate.resourceCountIs("AWS::DynamoDB::Table", 3);
    rootTemplate.resourceCountIs("AWS::Lambda::Function", 6);

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

    // // Check shared async resources
    rootTemplate.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      ProtocolType: "WEBSOCKET",
      Name: `gp-${projectName}-socket`,
    });
    rootTemplate.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-subscriptions`,
    });
    rootTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-subscribe`,
      Handler: "connect.connectHandler",
      Runtime: config.NODE_RUNTIME.name,
    });
    rootTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-unsubscribe`,
      Handler: "disconnect.disconnectHandler",
      Runtime: config.NODE_RUNTIME.name,
    });
    rootTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-send`,
      Handler: "sendmessage.sendHandler",
      Runtime: config.NODE_RUNTIME.name,
    });

    // // Check client resources
    rootTemplate.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-client`,
    });

    // // Check preprocessor resources
    lambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.preprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.preprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });

    // Check sync geoprocessing function resources
    lambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.geoprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });

    // Check async function resources
    lambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-start`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
      Runtime: config.NODE_RUNTIME.name,
    });
    lambdaStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-run`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
      Runtime: config.NODE_RUNTIME.name,
    });
  }, 200000);
});

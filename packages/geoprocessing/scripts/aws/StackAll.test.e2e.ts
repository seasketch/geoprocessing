import { App, NestedStack } from "aws-cdk-lib";
import { GeoprocessingStack, getHandlerPointer } from "./GeoprocessingStack.js";
import config from "./config.js";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle.js";
import path from "node:path";
import { describe, expect, afterAll } from "vitest";
import { Template } from "aws-cdk-lib/assertions";
import fs from "fs-extra";
import createTestBuild from "../testing/createTestBuild.js";

const rootPath = `${import.meta.dirname}/../__test__`;
const projectName = "all";
const projectPath = path.join(rootPath, projectName);

describe("GeoprocessingStack - all components", () => {
  afterAll(() => cleanupBuildDirs(projectPath));

  test("GeoprocessingStack - all components", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestBuild(projectName, projectPath, [
      "preprocessor",
      "syncGeoprocessor",
      "asyncGeoprocessor",
      "asyncGeoprocessorWorker",
      "client",
    ]);

    expect(manifest.clients.length).toBe(1);
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.geoprocessingFunctions.length).toBe(3);

    const app = new App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
      functionsPerStack: 2,
    });

    const rootTemplate = Template.fromStack(stack);

    // Lambda stack assertions

    const lambdaStacks = stack.node.children.filter(
      (child) => child instanceof NestedStack,
    );
    expect(lambdaStacks.length).toBe(2);

    // Lambda stack CDK template assertions

    const lambdaStackTemplate0 = Template.fromStack(
      lambdaStacks[0] as NestedStack,
    );

    const lambdaStackTemplate1 = Template.fromStack(
      lambdaStacks[1] as NestedStack,
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
      },
    );
    fs.writeJSONSync(
      `${snapPath}/StackAll_lambdaStack.test.e2e.ts.snap`,
      lambdaStackTemplate0.toJSON(),
      {
        spaces: 2,
      },
    );

    // Root stack assertions

    expect(stack.hasClients()).toEqual(true);
    expect(stack.hasSyncFunctions()).toEqual(true);
    expect(stack.hasAsyncFunctions()).toEqual(true);
    expect(stack.getSyncFunctionMetas().length).toBe(3);
    expect(stack.getAsyncFunctionMetas().length).toBe(1);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(3);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(1);

    rootTemplate.resourceCountIs("AWS::CloudFront::Distribution", 1);
    rootTemplate.resourceCountIs("AWS::S3::Bucket", 3);
    rootTemplate.resourceCountIs("AWS::ApiGateway::RestApi", 1);
    rootTemplate.resourceCountIs("AWS::ApiGateway::Stage", 1);
    rootTemplate.resourceCountIs("AWS::ApiGateway::Method", 13); // root (get, options), async (get, post, options), preprocessor (options, post), sync (get, post, options), sync worker (get, post, options)
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Api", 1); // web socket api
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Stage", 1);
    rootTemplate.resourceCountIs("AWS::ApiGatewayV2::Route", 3);
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

    // Check async function resources in lambda stack 0
    lambdaStackTemplate0.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-start`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
      Runtime: config.NODE_RUNTIME.name,
    });

    lambdaStackTemplate0.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-async-${manifest.geoprocessingFunctions[1].title}-run`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[1]),
      Runtime: config.NODE_RUNTIME.name,
    });

    // and sync worker function
    lambdaStackTemplate0.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.geoprocessingFunctions[2].title}`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[2]),
      Runtime: config.NODE_RUNTIME.name,
    });

    // Check sync geoprocessing function resources in lambda stack 1
    lambdaStackTemplate1.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.geoprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });

    // and preprocessor resources
    lambdaStackTemplate1.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.preprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.preprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });
  }, 200000);

  test("GeoprocessingStack - double worker use should throw", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestBuild(
      projectName + "_doubleWorker",
      projectPath,
      [
        "preprocessor",
        "syncGeoprocessor",
        "asyncGeoprocessor",
        "asyncGeoprocessorTwoSameWorker",
        "asyncGeoprocessorWorker",
        "client",
      ],
    );

    expect(manifest.clients.length).toBe(1);
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.geoprocessingFunctions.length).toBe(4);

    const app = new App();
    expect(
      () =>
        new GeoprocessingStack(app, projectName, {
          env: { region: manifest.region },
          projectName,
          manifest,
          projectPath,
          functionsPerStack: 2,
        }),
    ).toThrowError();
  }, 200000);

  test("GeoprocessingStack - missing worker option should throw", async () => {
    await setupBuildDirs(projectPath);

    const manifest = await createTestBuild(
      projectName + "_missingWorker",
      projectPath,
      [
        "preprocessor",
        "syncGeoprocessor",
        "asyncGeoprocessorMissingWork",
        "asyncGeoprocessorWorker",
        "client",
      ],
    );

    expect(manifest.clients.length).toBe(1);
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.geoprocessingFunctions.length).toBe(3);

    const app = new App();
    expect(
      () =>
        new GeoprocessingStack(app, projectName, {
          env: { region: manifest.region },
          projectName,
          manifest,
          projectPath,
          functionsPerStack: 2,
        }),
    ).toThrowError();
  }, 200000);
});

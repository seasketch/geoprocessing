/// <reference path='./Serverless.d.ts' />
import path from "path";
import fs from "fs";
import { SeaSketchGeoprocessingSettings } from "../handlers";
import slugify from "slugify";
import { GeoprocessingConfig } from "../metadata";

const HANDLER_PATH = ".handlers";

const makeHandler = (
  name: string | null,
  path: string,
  settings: SeaSketchGeoprocessingSettings
) => {
  return `// Generated file. Edit the contents of serverless.yml to change output.
const { 
  pluginInternals, 
  GeoprocessingTask, 
  Sketch,
  SeaSketchGeoprocessingSettings
} = require("@seasketch/serverless-geoprocessing");
const { TaskModel, fetchGeoJSON, handlerFactory } = pluginInternals;
${
  name && name.length
    ? `const func = require('${path}').${name};`
    : `const func = require('${path}');`
}

const settings = ${JSON.stringify(settings, null, "  ")};
module.exports = {
  handler: handlerFactory(func, settings)
};
`;
};

const pathAndNameForHandler = (
  handlerPath: string,
  servicePath: string
): [string, string | null] => {
  let handler = `${handlerPath}`;
  let index = handler.indexOf("./");
  if (index === 0) {
    // leading relative path
    handler = handler.slice(2);
  }
  index = handler.indexOf(".");
  if (index !== -1) {
    const extension = handler.slice(index + 1);
    if (extension === "js") {
      return [path.join(servicePath, handler.slice(0, index)), null];
    } else if (extension === "ts") {
      return [
        path.join(
          servicePath,
          HANDLER_PATH,
          handler
            .slice(0, index)
            .split("/")
            .slice(-1)[0]
        ),
        "default"
      ];
    } else {
      return [path.join(servicePath, handler.slice(0, index)), extension];
    }
  } else {
    return [path.join(servicePath, handler), null];
  }
};

class SeaSketchSLSGeoprocessingPlugin {
  options: Serverless.Options;
  serverless: Serverless.Instance;
  hooks: { [key: string]: Function };
  tasksTableName: string;
  clientBucketName: string;

  constructor(serverless: Serverless.Instance, options: Serverless.Options) {
    this.options = options;
    this.serverless = serverless;
    this.tasksTableName = slugify(serverless.service.service) + "-tasks";
    this.clientBucketName =
      slugify(serverless.service.service).toLowerCase() + "-client";

    this.hooks = {
      "before:package:setupProviderConfiguration": async () => {
        await this.addCommonResources();
        await this.addFunctionDefinitions();
      }
      // "aws:package:finalize:cleanupFiles": async () => {
      //   await this.cleanup();
      // }
    };
  }

  async addCommonResources() {
    this.serverless.cli.log("Create common resources: database");
    if (
      !this.serverless.service.resources ||
      !this.serverless.service.resources.Resources
    ) {
      this.serverless.service.resources = { Resources: {} };
    }
    if (!this.serverless.service.provider.environment) {
      this.serverless.service.provider.environment = {};
    }
    this.serverless.service.provider.environment.SERVICE_URL = {
      "Fn::Join": [
        "",
        [
          "https://",
          { Ref: "ApiGatewayRestApi" },
          ".execute-api.",
          this.serverless.service.provider.region,
          ".amazonaws.com/",
          this.serverless.service.provider.stage
        ]
      ]
    };
    const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
    const pluginPkg = JSON.parse(
      fs.readFileSync(`${__dirname}/../../../package.json`).toString()
    );
    this.serverless.service.provider.environment.GEOPROCESSING_CONFIG = JSON.stringify(
      {
        ...this.serverless.service.custom.geoprocessing,
        publishedDate: new Date().toISOString(),
        relatedUri: pkg.homepage,
        clientUri: `https://${this.clientBucketName}.s3-${this.serverless.service.provider.region}.amazonaws.com/index.html`,
        author: pkg.author,
        description: pkg.description,
        apiVersion: pluginPkg.version,
        title: this.serverless.service.service
      } as GeoprocessingConfig
    );

    this.serverless.service.resources.Resources.tasksTable = {
      Type: "AWS::DynamoDB::Table",
      Properties: {
        TableName: this.tasksTableName,
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH"
          },
          {
            AttributeName: "service",
            KeyType: "RANGE"
          }
        ],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "service", AttributeType: "S" }
        ],
        BillingMode: "PAY_PER_REQUEST",
        TimeToLiveSpecification: {
          AttributeName: "ttl",
          Enabled: true
        }
      }
    };
    if (!this.serverless.service.provider.iamRoleStatements) {
      this.serverless.service.provider.iamRoleStatements = [];
    }
    this.serverless.service.provider.iamRoleStatements.push({
      Effect: "Allow",
      Action: [
        "dynamodb:BatchGet*",
        "dynamodb:DescribeStream",
        "dynamodb:DescribeTable",
        "dynamodb:Get*",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchWrite*",
        "dynamodb:CreateTable",
        "dynamodb:Delete*",
        "dynamodb:Update*",
        "dynamodb:PutItem"
      ],
      Resource: { "Fn::GetAtt": ["tasksTable", "Arn"] }
    });
    this.serverless.service.resources.Resources.clientBucket = {
      Type: "AWS::S3::Bucket",
      Properties: {
        BucketName: this.clientBucketName
      }
    };
    if (!this.serverless.service.custom) {
      this.serverless.service.custom = {};
    }
    this.serverless.service.custom.includeDependencies = {
      always: ["src/services/**.js", "handlers/*.js"]
    };
    this.serverless.service.custom.s3Sync = [
      {
        bucketName: this.clientBucketName,
        localDir: path.join("./", "build"),
        acl: "public-read"
      }
    ];
  }

  async addFunctionDefinitions() {
    this.serverless.cli.log("Add function definitions.... handler");
    const custom = (this.serverless.service as any).custom || {};
    if ("geoprocessing" in custom) {
      const geoprocessingConfig = custom.geoprocessing;
      if ("services" in geoprocessingConfig) {
        const handlerDir = HANDLER_PATH;
        if (!fs.existsSync(handlerDir)) {
          fs.mkdirSync(handlerDir);
        }
        for (const serviceName in geoprocessingConfig.services) {
          const conf = geoprocessingConfig.services[serviceName];
          const [handlerPath, funcName] = pathAndNameForHandler(
            conf.handler,
            this.serverless.config.servicePath
          );
          const handler = makeHandler(
            funcName,
            "./" +
              path.relative(
                path.join(this.serverless.config.servicePath, handlerDir),
                handlerPath
              ),
            {
              executionMode: conf.executionMode || "sync",
              restrictedAccess: conf.restrictedAccess || false,
              serviceName: serviceName,
              tasksTable: this.tasksTableName
            }
          );
          const newHandlerPath = path.join(
            handlerDir,
            `${serviceName}-handler.js`
          );
          fs.writeFileSync(newHandlerPath, handler);
          this.serverless.service.functions[serviceName] = {
            ...conf,
            handler: newHandlerPath.replace(".js", ".handler"),
            events: [
              { http: { method: "post", path: serviceName, cors: true } }
            ],
            name: [
              this.serverless.service.service,
              this.serverless.service.provider.stage,
              serviceName
            ].join("-")
          };
        }
        const metadataHandlerPath = ".handlers/metadata.js";
        fs.writeFileSync(
          metadataHandlerPath,
          `
          const { pluginInternals } = require("@seasketch/serverless-geoprocessing");
          module.exports = {
            handler: pluginInternals.metadataHandler
          }
        `
        );
        this.serverless.service.functions["metadata"] = {
          handler: metadataHandlerPath.replace(".js", ".handler"),
          memorySize: 256,
          timeout: 3,
          events: [{ http: { method: "get", path: "/", cors: true } }],
          name: [
            this.serverless.service.service,
            this.serverless.service.provider.stage,
            "metadata"
          ].join("-")
        };
      } else {
        throw new Error(
          "Services list not found in custom:geoprocessing config"
        );
      }
    } else {
      throw new Error(
        "Geoprocessing configuration not found in serverless.yml"
      );
    }
  }
}

module.exports = SeaSketchSLSGeoprocessingPlugin;

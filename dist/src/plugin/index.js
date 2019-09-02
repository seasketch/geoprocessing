"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='./Serverless.d.ts' />
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const templateContents = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../src/', 'handlers.ts')).toString();
const body = templateContents.split('// END HEADER')[1];
const makeHandler = (name, path, settings) => {
    return `// Generated file. Edit the contents of serverless.yml to change output.
// @ts-ignore
import { pluginInternals, GeoprocessingTask } from "@seasketch/geoprocessing";
import { Sketch } from "@seasketch/geoprocessing";
const { TaskModel, fetchGeoJSON } = pluginInternals;
${name && name.length ? `import { ${name} as func } from '${path}'` : `import func from '${path}'`}
${body}

const settings = ${JSON.stringify(settings, null, "  ")} as SeaSketchGeoprocessingSettings;
export const handler = lambdaService(func, settings);
`;
};
const pathAndNameForHandler = (handlerPath, servicePath) => {
    let handler = `${handlerPath}`;
    let index = handler.indexOf("./");
    if (index === 0) {
        // leading relative path
        handler = handler.slice(2);
    }
    index = handler.indexOf(".");
    if (index !== -1) {
        const extension = handler.slice(index + 1);
        if (extension === "js" || extension === "ts") {
            return [path_1.default.join(servicePath, handler.slice(0, index)), null];
        }
        else {
            return [path_1.default.join(servicePath, handler.slice(0, index)), extension];
        }
    }
    else {
        return [path_1.default.join(servicePath, handler), null];
    }
};
class SeaSketchSLSGeoprocessingPlugin {
    constructor(serverless, options) {
        this.options = options;
        this.serverless = serverless;
        this.tasksTableName = serverless.service.service + "-tasks";
        this.hooks = {
            "package:initialize": async () => {
                await this.addCommonResources();
                await this.addFunctionDefinitions();
            },
            "after:deploy:functions": async () => {
                await this.cleanup();
            },
        };
    }
    async addCommonResources() {
        this.serverless.cli.log("Create common resources: database");
        if (!this.serverless.service.resources || !this.serverless.service.resources.Resources) {
            this.serverless.service.resources = { Resources: {} };
        }
        this.serverless.service.resources.Resources.tasksTable = {
            Type: "AWS::DynamoDB::Table",
            Properties: {
                TableName: this.tasksTableName,
                KeySchema: [
                    {
                        AttributeName: 'id',
                        KeyType: 'HASH'
                    },
                    {
                        AttributeName: 'service',
                        KeyType: "RANGE"
                    }
                ],
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' },
                    { AttributeName: 'service', AttributeType: 'S' },
                ],
                BillingMode: 'PAY_PER_REQUEST',
                TimeToLiveSpecification: {
                    "AttributeName": "ttl",
                    "Enabled": true
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
            Resource: { 'Fn::GetAtt': ["tasksTable", "Arn"] }
        });
    }
    async cleanup() {
        const custom = this.serverless.service.custom || {};
        if ('geoprocessing' in custom) {
            const geoprocessingConfig = custom.geoprocessing;
            if ('services' in geoprocessingConfig) {
                for (const serviceName in geoprocessingConfig.services) {
                    const newHandlerPath = path_1.default.join(".", `${serviceName}.ts`);
                    fs_1.default.unlinkSync(newHandlerPath);
                }
            }
        }
    }
    async addFunctionDefinitions() {
        this.serverless.cli.log("Add function definitions");
        const custom = this.serverless.service.custom || {};
        if ('geoprocessing' in custom) {
            const geoprocessingConfig = custom.geoprocessing;
            if ('services' in geoprocessingConfig) {
                for (const serviceName in geoprocessingConfig.services) {
                    const conf = geoprocessingConfig.services[serviceName];
                    const [handlerPath, funcName] = pathAndNameForHandler(conf.handler, this.serverless.config.servicePath);
                    const handler = makeHandler(funcName, "./" + path_1.default.relative(this.serverless.config.servicePath, handlerPath), {
                        executionMode: conf.executionMode || "sync",
                        restrictedAccess: conf.restrictedAccess || false,
                        serviceName: serviceName,
                        tasksTable: this.tasksTableName
                    });
                    const newHandlerPath = path_1.default.join(".", `${serviceName}.ts`);
                    fs_1.default.writeFileSync(newHandlerPath, handler);
                    this.serverless.service.functions[serviceName] = {
                        ...conf,
                        handler: newHandlerPath.replace(".ts", ".handler"),
                        events: [{ http: { method: 'post', path: serviceName } }],
                        name: [this.serverless.service.service, this.serverless.service.provider.stage, serviceName].join("-")
                    };
                }
            }
            else {
                throw new Error("Services list not found in custom:geoprocessing config");
            }
        }
        else {
            throw new Error("Geoprocessing configuration not found in serverless.yml");
        }
    }
}
module.exports = SeaSketchSLSGeoprocessingPlugin;

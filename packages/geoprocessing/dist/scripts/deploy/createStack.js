"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@aws-cdk/core"));
const s3 = __importStar(require("@aws-cdk/aws-s3"));
const apigateway = __importStar(require("@aws-cdk/aws-apigateway"));
const lambda = __importStar(require("@aws-cdk/aws-lambda"));
const cloudfront = __importStar(require("@aws-cdk/aws-cloudfront"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dynamodb = require("@aws-cdk/aws-dynamodb");
const slugify_1 = __importDefault(require("slugify"));
const s3deploy = __importStar(require("@aws-cdk/aws-s3-deployment"));
if (!process.env.PROJECT_PATH) {
    throw new Error("PROJECT_PATH env var not specified");
}
const PROJECT_PATH = process.env.PROJECT_PATH;
const manifest = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, ".build", "manifest.json")).toString());
async function createStack() {
    const projectName = manifest.title;
    const region = manifest.region;
    const stackName = `${projectName}-geoprocessing-stack`;
    const app = new core.App();
    const stack = new GeoprocessingCdkStack(app, stackName, {
        env: { region },
        project: projectName
    });
    core.Tag.add(stack, "Author", slugify_1.default(manifest.author.replace(/\<.*\>/, "")));
    core.Tag.add(stack, "Cost Center", "seasketch-geoprocessing");
    core.Tag.add(stack, "Geoprocessing Project", manifest.title);
}
exports.createStack = createStack;
class GeoprocessingCdkStack extends core.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /** Client Assets */
        // client bundle buckets
        const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
            bucketName: `${props.project}-client-${this.region}`,
            websiteIndexDocument: "index.html",
            publicReadAccess: true
        });
        // client bundle cloudfront
        const distribution = new cloudfront.CloudFrontWebDistribution(
        // @ts-ignore
        this, "ClientDistribution", {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: websiteBucket
                    },
                    behaviors: [{ isDefaultBehavior: true }]
                }
            ]
        });
        // Will run cloudfront invalidation on changes
        new s3deploy.BucketDeployment(
        // @ts-ignore
        this, "DeployWebsite", {
            sources: [s3deploy.Source.asset(path_1.default.join(PROJECT_PATH, ".build-web"))],
            destinationBucket: websiteBucket,
            distribution: distribution,
            distributionPaths: ["/*"]
        });
        /** Lambda Service Assets */
        // Bucket for storing outputs of geoprocessing functions. These resources
        // will be accessible via a public url, though the location will be hidden
        // and cannot be listed by clients.
        const publicBucket = new s3.Bucket(this, `PublicResults`, {
            bucketName: `${props.project}-public-${this.region}`,
            versioned: false,
            publicReadAccess: true,
            cors: [
                {
                    allowedOrigins: ["*"],
                    allowedMethods: ["HEAD", "GET"],
                    allowedHeaders: ["*"],
                    id: "my-cors-rule-1",
                    maxAge: 3600
                }
            ],
            removalPolicy: core.RemovalPolicy.DESTROY
        });
        const publicBucketUrl = publicBucket.urlForObject();
        // dynamodb
        const tasksTbl = new dynamodb.Table(this, `gp-${manifest.title}-tasks`, {
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "service", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: `gp-${manifest.title}-tasks`,
            removalPolicy: core.RemovalPolicy.DESTROY
        });
        // project metadata endpoints
        const api = new apigateway.RestApi(this, `${props.project}-geoprocessing-api`, {
            restApiName: `${props.project} geoprocessing service`,
            description: `Serves API requests for ${props.project}.`,
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS
            }
        });
        const metadataHandler = new lambda.Function(this, "MetadataHandler", {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.asset(path_1.default.join(PROJECT_PATH, ".build")),
            handler: "serviceHandlers.projectMetadata",
            environment: {
                publicBucketUrl,
                clientUrl: distribution.domainName
            }
        });
        tasksTbl.grantReadData(metadataHandler);
        const getMetadataIntegration = new apigateway.LambdaIntegration(metadataHandler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });
        api.root.addMethod("GET", getMetadataIntegration); // GET /
        // function endpoints
        for (const func of manifest.functions) {
            // @ts-ignore
            const filename = path_1.default.basename(func.handler);
            const handler = new lambda.Function(this, `${func.title}Handler`, {
                runtime: lambda.Runtime.NODEJS_12_X,
                code: lambda.Code.asset(path_1.default.join(PROJECT_PATH, ".build")),
                handler: `${filename.split(".")[0]}Handler.handler`,
                functionName: `gp-${manifest.title}-${func.title}`,
                memorySize: func.memory,
                timeout: core.Duration.seconds(func.timeout || 3),
                description: func.description,
                environment: {
                    publicBucketUrl,
                    TASKS_TABLE: tasksTbl.tableName
                }
            });
            tasksTbl.grantReadWriteData(handler);
            publicBucket.grantReadWrite(handler);
            const postIntegration = new apigateway.LambdaIntegration(handler, {
                requestTemplates: { "application/json": '{ "statusCode": "200" }' }
            });
            const resource = api.root.addResource(func.title);
            resource.addMethod("POST", postIntegration);
            new core.CfnOutput(this, "ProjectRoot", {
                value: api.urlForPath("/")
            });
        }
    }
}
createStack();
//# sourceMappingURL=createStack.js.map
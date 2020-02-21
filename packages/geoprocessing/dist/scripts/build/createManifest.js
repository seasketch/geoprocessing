"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mock_require_1 = __importDefault(require("mock-require"));
mock_require_1.default("aws-sdk", {
    DynamoDB: {
        DocumentClient: function () { }
    },
    Lambda: function () { }
});
const PROJECT_PATH = process.env.PROJECT_PATH;
const config = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "geoprocessing.json")).toString());
const pkgGeo = JSON.parse(fs_1.default.readFileSync("./package.json").toString());
const projectPkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "package.json")).toString());
const projectMetadata = {
    title: projectPkg.name,
    author: config.author,
    region: config.region,
    apiVersion: pkgGeo.version,
    version: projectPkg.version,
    relatedUri: projectPkg.homepage,
    sourceUri: projectPkg.repository ? projectPkg.repository.url : null,
    published: new Date().toISOString(),
    preprocessingServices: [],
    clients: config.clients,
    feebackClients: [],
    functions: []
};
if (config.functions.length < 1) {
    throw new Error("No functions specified in geoprocessing.json");
}
// console.log(config.functions);
for (const func of config.functions) {
    const name = path_1.default.basename(func).replace(".ts", ".js");
    const opts = require(path_1.default.join(PROJECT_PATH, ".build", name)).options;
    projectMetadata.functions.push({
        handler: name,
        ...opts,
        rateLimited: false,
        rateLimit: 0,
        rateLimitPeriod: "daily",
        rateLimitConsumed: 0,
        medianDuration: 0,
        medianCost: 0,
        type: "javascript",
        issAllowList: ["*"]
    });
}
fs_1.default.writeFileSync(path_1.default.join(PROJECT_PATH, ".build", "manifest.json"), JSON.stringify(projectMetadata, null, "  "));
//# sourceMappingURL=createManifest.js.map
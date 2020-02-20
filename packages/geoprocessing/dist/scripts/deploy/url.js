"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const PROJECT_PATH = process.env.PROJECT_PATH;
if (!PROJECT_PATH) {
    throw new Error("process.env.PROJECT_PATH not defined");
}
const pkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "package.json")).toString());
const packageName = pkg.name;
const geoprocessing = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "geoprocessing.json")).toString());
const cf = new aws_sdk_1.default.CloudFormation({ region: geoprocessing.region });
cf.describeStacks({ StackName: `${packageName}-geoprocessing-stack` }, (err, data) => {
    var _a;
    if (err) {
        throw err;
    }
    if (!data.Stacks || !data.Stacks.length) {
        throw new Error(`No stack named ${packageName}-geoprocessing-stack`);
    }
    const Outputs = data.Stacks[0].Outputs;
    const output = (_a = Outputs) === null || _a === void 0 ? void 0 : _a.find(o => o.OutputKey === "ProjectRoot");
    if (!output) {
        throw new Error("Could not find output named ProjectRoot");
    }
    console.log(output.OutputValue);
    process.exit();
});
//# sourceMappingURL=url.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_typescript_1 = __importDefault(require("@rollup/plugin-typescript"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
// import { terser } from "rollup-plugin-terser";
const plugin_virtual_1 = __importDefault(require("@rollup/plugin-virtual"));
const PROJECT_PATH = process.env.PROJECT_PATH;
// const manifest = JSON.parse(
//   fs.readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json")).toString()
// );
const pkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "package.json")).toString());
const functions = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "geoprocessing.json")).toString()).functions.map(f => path_1.default.join(PROJECT_PATH, f));
// const functions = manifest.functions.map(f =>
//   path.join(PROJECT_PATH, f.handler)
// );
// These wrappers are necessary because otherwise the GeoprocessingHandler
// class methods can't properly reference `this`
const handlers = [];
for (const func of functions) {
    const handlerPath = `./.build/${path_1.default
        .basename(func)
        .split(".")
        .slice(0, -1)
        .join(".")}Handler.ts`;
    fs_1.default.writeFileSync(handlerPath, `
    import Handler from "${func.replace(".ts", "")}";
    import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
    export const handler = async (event:APIGatewayEvent, context:Context): Promise<APIGatewayProxyResult> => {
      return await Handler.lambdaHandler(event, context);
    }
  `);
    handlers.push(handlerPath);
}
exports.default = {
    input: [...functions, ...handlers],
    plugins: [
        plugin_json_1.default(),
        plugin_typescript_1.default({
            include: ["*/**.ts", "../example-project/**/*.ts"]
        }),
        // virtual({
        //   manifest: `
        //     export default ${fs
        //       .readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json"))
        //       .toString()}
        //   `
        // }),
        plugin_node_resolve_1.default({
            include: "@seasketch/geoprocessing"
        }),
        plugin_commonjs_1.default({
            include: "node_modules/**/*"
        }),
        plugin_virtual_1.default({
            packageName: `export default "${pkg.name}";`
        })
    ],
    output: {
        format: "cjs",
        dir: "./.build",
        sourcemap: true,
        plugins: []
    },
    treeshake: {
        moduleSideEffects: false
    },
    external: id => {
        // Everything in PROJECT_PATH/node_modules should be external
        // parts of @seasketch/geoprocessing that should be external
        // the build script will need to copy them
        return externals.indexOf(id) !== -1;
    }
};
const staticExternals = ["@turf/area", "uuid", "aws-sdk"];
const projectNodeModules = Object.keys(JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "package.json")).toString()).dependencies);
const externals = [...staticExternals, ...projectNodeModules].filter(n => n !== "@seasketch/geoprocessing");
//# sourceMappingURL=rollup.functions.config.js.map
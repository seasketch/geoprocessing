"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_typescript_1 = __importDefault(require("@rollup/plugin-typescript"));
// import typescript from "rollup-plugin-typescript2";
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const plugin_virtual_1 = __importDefault(require("@rollup/plugin-virtual"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const PROJECT_PATH = process.env.PROJECT_PATH;
const config = JSON.parse(fs_1.default.readFileSync(`${PROJECT_PATH}/geoprocessing.json`));
const pkgGeo = JSON.parse(fs_1.default.readFileSync("./package.json"));
const projectPkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(PROJECT_PATH, "package.json")));
const projectMetadata = {
    title: projectPkg.name,
    version: projectPkg.version,
    relatedUri: projectPkg.homepage,
    sourceUri: projectPkg.repository ? projectPkg.repository.url : null,
    published: new Date().toISOString(),
    // TODO: handle these extended config options
    preprocessingServices: [],
    clients: [],
    feebackClients: []
};
if (config.functions.length < 1) {
    throw new Error("No functions specified in geoprocessing.json");
}
// console.log(config.functions[0].split("/").slice(-1));
fs_1.default.writeFileSync("./.metadata.ts", `
${config.functions
    .map(f => {
    return `import ${f
        .split("/")
        .slice(-1)[0]
        .split(".")[0]} from "${path_1.default.join(PROJECT_PATH, f)}";`;
})
    .join("\n")}
const functions = {
  ${config.functions
    .map(p => {
    return `"${p}": ${p
        .split("/")
        .slice(-1)[0]
        .split(".")[0]}.options`;
})
    .join(",\n")}
};
const metadata = {
  ...(${JSON.stringify(projectMetadata)}),
  apiVersion: "${pkgGeo.version}",
  ...(${JSON.stringify(config)}),
  functions: Object.keys(functions).map((handler) => {
    return {
      ...functions[handler],
      handler,
      rateLimited: false,
      rateLimit: 0,
      rateLimitPeriod: "daily",
      rateLimitConsumed: 0,
      medianDuration: 0,
      medianCost: 0,
      type: "javascript",
      issAllowList: ["*"]
    }
  })
}
export default metadata;
`);
exports.default = {
    input: [
        "./.metadata.ts",
        ...config.functions.map(f => path_1.default.join(PROJECT_PATH, f))
    ],
    // external: id => {
    //   if (/@seasketch\/geoprocessing/.test(id)) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // },
    plugins: [
        plugin_json_1.default(),
        plugin_typescript_1.default({
            include: ["*/**.ts", "../example-project/**/*.ts"]
        }),
        plugin_virtual_1.default({
            "@seasketch/geoprocessing": `
        const sketchArea = (s) => 100;

        class GeoprocessingHandler {
          constructor(fn, options) {
            this.func = fn;
            this.options = options;
          }
        }
        export {
          sketchArea,
          GeoprocessingHandler
        }`
        }),
        plugin_node_resolve_1.default({
            customResolveOptions: {
                paths: [path_1.default.join(PROJECT_PATH, "node_modules")]
            }
        }),
        plugin_commonjs_1.default()
        // multi()
    ],
    output: {
        format: "cjs",
        dir: "./.build",
        plugins: [],
        sourcemap: true
    },
    treeshake: {
        moduleSideEffects: false
    }
};
//# sourceMappingURL=rollup.metadata.config.js.map
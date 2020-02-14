"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_typescript_1 = __importDefault(require("@rollup/plugin-typescript"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const plugin_virtual_1 = __importDefault(require("@rollup/plugin-virtual"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const PROJECT_PATH = process.env.PROJECT_PATH;
exports.default = {
    input: ["./src/serviceHandlers.ts"],
    plugins: [
        plugin_json_1.default(),
        plugin_typescript_1.default({
            include: [
                "*/**.ts",
                path_1.default.relative(__dirname + "../../../", `${PROJECT_PATH}`) + "/**/*.ts"
            ]
        }),
        plugin_virtual_1.default({
            manifest: `
        export default ${fs_1.default
                .readFileSync(path_1.default.join(PROJECT_PATH, ".build", "manifest.json"))
                .toString()}
      `
        }),
        plugin_node_resolve_1.default()
    ],
    output: {
        format: "cjs",
        dir: "./.build",
        sourcemap: true,
        plugins: []
    },
    treeshake: {
        moduleSideEffects: false
    }
};
//# sourceMappingURL=rollup.services.config.js.map
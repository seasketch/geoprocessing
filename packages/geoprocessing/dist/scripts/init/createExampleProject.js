"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = __importDefault(require("./init"));
const createFunction_1 = require("./createFunction");
const fs_extra_1 = __importDefault(require("fs-extra"));
const PATH = `packages/example-project`;
(async () => {
    const inLernaProjectRoot = await fs_extra_1.default.pathExists("./lerna.json");
    if (!inLernaProjectRoot) {
        throw new Error("createExampleProject is designed to be run from multi-project repo root.");
    }
    const pathExists = await fs_extra_1.default.pathExists(PATH);
    if (pathExists) {
        await fs_extra_1.default.remove(PATH);
    }
    await init_1.default({
        name: "example-project",
        description: "Example project to test geoprocessing project init scripts",
        author: "Chad Burt",
        email: "support@seasketch.org",
        license: "BSD-3-Clause",
        organization: "SeaSketch",
        repositoryUrl: "https://github.com/seasketch/example-project",
        region: "us-west-1"
    }, false, PATH.split("/")
        .slice(0, -1)
        .join("/"));
    await createFunction_1.makeGeoprocessingHandler({
        title: "area",
        typescript: true,
        description: "Produces the area of the given sketch",
        docker: false,
        executionMode: "sync"
    }, false, PATH + "/");
    await fs_extra_1.default.copyFile(`${__dirname}/../../templates/exampleSketch.json`, PATH + "/examples/sketches/sketch.json");
    await fs_extra_1.default.copyFile(`${__dirname}/../../templates/exampleProject.test.ts`, PATH + "/src/exampleProject.test.ts");
})();
//# sourceMappingURL=createExampleProject.js.map
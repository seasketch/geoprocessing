"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
/** Reads sketches from examples/sketches for testing. Run from project root */
async function getExampleSketches() {
    let filenames = await fs_extra_1.default.readdir("examples/sketches");
    const sketches = [];
    await Promise.all(filenames
        .filter(fname => /\.json/.test(fname))
        .map(async (f) => {
        const sketch = await fs_extra_1.default.readJSON(`examples/sketches/${f}`);
        sketches.push(sketch);
    }));
    return sketches;
}
exports.getExampleSketches = getExampleSketches;
async function writeResultOutput(results, functionName, sketchName) {
    if (!fs_extra_1.default.existsSync("examples/output")) {
        await fs_extra_1.default.mkdir("examples/output");
    }
    const folder = "examples/output/" + sketchName;
    if (!fs_extra_1.default.existsSync(folder)) {
        await fs_extra_1.default.mkdir(folder);
    }
    fs_extra_1.default.writeFile(folder + "/" + functionName + ".json", JSON.stringify(results, null, "  "));
}
exports.writeResultOutput = writeResultOutput;
//# sourceMappingURL=index.js.map
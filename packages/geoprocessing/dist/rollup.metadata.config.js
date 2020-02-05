import typescript from "@rollup/plugin-typescript";
// import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import fs from "fs";
import path from "path";
const virtual = require("@rollup/plugin-virtual");
const PROJECT_PATH = process.env.PROJECT_PATH;
const config = JSON.parse(fs.readFileSync(`${PROJECT_PATH}/geoprocessing.json`));
if (config.functions.length < 1) {
    throw new Error("No functions specified in geoprocessing.json");
}
// console.log(config.functions[0].split("/").slice(-1));
fs.writeFileSync("./.metadata.ts", `
${config.functions
    .map(f => {
    return `import ${f
        .split("/")
        .slice(-1)[0]
        .split(".")[0]} from "${path.join(PROJECT_PATH, f)}";`;
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
  ...(${JSON.stringify(config)}),
  functions
}
console.log(JSON.stringify(metadata));
export default metadata;
`);
export default {
    input: [
        "./.metadata.ts",
        ...config.functions.map(f => path.join(PROJECT_PATH, f))
    ],
    plugins: [
        json(),
        typescript({
            include: ["*/**.ts", "../example-project/**/*.ts"]
        }),
        virtual({
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
        })
        // multi()
    ],
    output: {
        format: "cjs",
        dir: "./.build",
        plugins: []
    },
    treeshake: {
        moduleSideEffects: false
    }
};
//# sourceMappingURL=rollup.metadata.config.js.map
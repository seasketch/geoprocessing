import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import fs from "fs";
import path from "path";
import virtual from "@rollup/plugin-virtual";
import resolve from "@rollup/plugin-node-resolve";

const PROJECT_PATH = process.env.PROJECT_PATH;

export default {
  input: ["./src/serviceHandlers.ts"],
  plugins: [
    json(),
    typescript({
      include: [
        "*/**.ts",
        path.relative(__dirname + "../../../", `${PROJECT_PATH}`) + "/**/*.ts"
      ]
    }),
    virtual({
      manifest: `
        export default ${fs
          .readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json"))
          .toString()}
      `
    }),
    resolve()
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

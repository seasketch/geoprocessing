import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import fs from "fs";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
// import { terser } from "rollup-plugin-terser";
// import virtual from "@rollup/plugin-virtual";

const PROJECT_PATH = process.env.PROJECT_PATH;
// const manifest = JSON.parse(
//   fs.readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json")).toString()
// );
const functions = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
).functions.map(f => path.join(PROJECT_PATH, f));
// const functions = manifest.functions.map(f =>
//   path.join(PROJECT_PATH, f.handler)
// );

export default {
  input: functions,
  plugins: [
    json(),
    typescript({
      include: ["*/**.ts", "../example-project/**/*.ts"]
    }),
    // virtual({
    //   manifest: `
    //     export default ${fs
    //       .readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json"))
    //       .toString()}
    //   `
    // }),
    resolve({
      // include: "@seasketch/geoprocessing"
    }),
    commonjs({
      include: "node_modules/**/*"
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
const projectNodeModules = Object.keys(
  JSON.parse(
    fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
  ).dependencies
);
const externals = [...staticExternals, ...projectNodeModules].filter(
  n => n !== "@seasketch/geoprocessing"
);

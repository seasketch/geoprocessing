import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import fs from "fs";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import virtual from "@rollup/plugin-virtual";

const PROJECT_PATH = process.env.PROJECT_PATH;
const pkg = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
);
const functions = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
).functions.map(f => path.join(PROJECT_PATH, f));

// These wrappers are necessary because otherwise the GeoprocessingHandler
// class methods can't properly reference `this`
const handlers = [];
for (const func of functions) {
  const handlerPath = `./.build/${path
    .basename(func)
    .split(".")
    .slice(0, -1)
    .join(".")}Handler.ts`;
  fs.writeFileSync(
    handlerPath,
    `
    import Handler from "${func.replace(".ts", "")}";
    import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
    export const handler = async (event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
      return await Handler.lambdaHandler(event, context);
    }
  `
  );
  handlers.push(handlerPath);
}

// TODO: Output some bundle size info and audit what is taking up the most
// space. These bundles seem a little larger than they should be.

export default {
  input: [...functions, ...handlers],
  plugins: [
    json(),
    typescript({
      include: [
        "*/**.ts",
        path.relative(__dirname + "../../../", `${PROJECT_PATH}`) + "/**/*.ts"
      ]
    }),
    resolve({
      include: "@seasketch/geoprocessing"
    }),
    commonjs({
      include: "node_modules/**/*",
      exclude: "node_modules/node-fetch"
    }),
    virtual({
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
    moduleSideEffects: path => {
      return /fetchPolyfill/.test(path);
    }
  },
  external: id => {
    // Everything in PROJECT_PATH/node_modules should be external
    // parts of @seasketch/geoprocessing that should be external
    // the build script will need to copy them
    return externals.indexOf(id) !== -1;
  }
};

const staticExternals = [
  "@turf/area",
  "uuid",
  "aws-sdk",
  "node-fetch",
  "node-abort-controller"
  // // node-fetch stuff
  // "https",
  // "stream",
  // "http",
  // "zlib"
];
const projectNodeModules = Object.keys(
  JSON.parse(
    fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
  ).dependencies || {}
);
const externals = [...staticExternals, ...projectNodeModules].filter(
  n => n !== "@seasketch/geoprocessing"
);

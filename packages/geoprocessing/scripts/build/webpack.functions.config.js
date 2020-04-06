const fs = require("fs");
const path = require("path");

const PROJECT_PATH = process.env.PROJECT_PATH;
const GP_ROOT = path.join(__dirname, "../../");
if (!PROJECT_PATH) {
  throw new Error("process.env.PROJECT_PATH not set");
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
);
const geoprocessing = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
);

const dir = path.join(GP_ROOT, ".build");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// These wrappers are necessary because otherwise the GeoprocessingHandler
// class methods can't properly reference `this`
const handlers = [];
for (const func of geoprocessing.functions) {
  const handlerPath = path.join(
    GP_ROOT,
    `.build/${path
      .basename(func)
      .split(".")
      .slice(0, -1)
      .join(".")}Handler.ts`
  );
  fs.writeFileSync(
    handlerPath,
    `
    import Handler from "${path.join(PROJECT_PATH, func).replace(/\.ts$/, "")}";
    import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
    export const handler = async (event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
      return await Handler.lambdaHandler(event, context);
    }
  `
  );
  handlers.push(handlerPath);
}

if (!geoprocessing.functions && !geoprocessing.functions.length) {
  throw new Error("No functions found in geoprocessing.json");
}

module.exports = {
  mode: "production",
  entry: {
    ...handlers.reduce((prev, f) => {
      prev[path.basename(f)] = f;
      return prev;
    }, {}),
    serviceHandlers: path.join(GP_ROOT, "src/serviceHandlers.ts")
  },
  output: {
    filename: chunkData => {
      if (/.ts$/.test(chunkData.chunk.name)) {
        return chunkData.chunk.name.replace(/.ts$/, ".js");
      } else {
        return "[name].js";
      }
    },
    path: path.join(GP_ROOT, ".build"),
    libraryTarget: "commonjs2"
  },
  target: "node",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [
      path.resolve(__dirname, "../../node_modules"),
      path.join(PROJECT_PATH, "node_modules")
    ]
  },
  performance: {
    maxAssetSize: 500000,
    maxEntrypointSize: 500000,
    hints: "warning"
  },
  externals: function(context, request, callback) {
    if (externals.indexOf(request) !== -1) {
      return callback(null, "commonjs " + request);
    } else {
      return callback();
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules\/(?!(@seasketch\/geoprocessing)\/).*/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                require.resolve("@babel/preset-env"),
                { targets: { node: "12" } }
              ],
              require.resolve("@babel/preset-typescript")
            ]
          }
        }
      }
    ]
  }
};

const staticExternals = ["aws-sdk"];
const projectNodeModules = Object.keys(
  JSON.parse(
    fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
  ).dependencies || {}
);
const externals = [...staticExternals, ...projectNodeModules].filter(
  n => n !== "@seasketch/geoprocessing"
);

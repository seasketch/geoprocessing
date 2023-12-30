const fs = require("fs");
const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ThreadsPlugin = require("threads-plugin");

const PROJECT_PATH = process.env.PROJECT_PATH;
const GP_ROOT = path.join(__dirname, "../../");
if (!PROJECT_PATH) {
  throw new Error("process.env.PROJECT_PATH not set");
}

const geoprocessing = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
);
if (!geoprocessing) {
  throw new Error("geoprocessing.json not found");
}

const dir = path.join(GP_ROOT, ".build");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

/**
 * Generates a root function for each Lambda that manages request and response, invoking the underlying Handler.
 * This wrapper is necessary because otherwise the GeoprocessingHandler class methods can't properly reference `this`
 */
function generateHandler(funcPath) {
  const handlerFilename = path.basename(funcPath);
  const handlerPath = path.join(
    GP_ROOT,
    `.build/${handlerFilename.split(".").slice(0, -1).join(".")}Handler.ts`
  );
  fs.writeFileSync(
    handlerPath,
    `
    import { VectorDataSource } from "@seasketch/geoprocessing";
    import Handler from "${path
      .join(PROJECT_PATH, funcPath)
      .replace(/\.ts$/, "")}";
    import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
    export const handler = async (event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
      return await Handler.lambdaHandler(event, context);
    }
    // Exports for manifest
    export const handlerFilename = '${handlerFilename}';
    export const options = Handler.options;
    export const sources = VectorDataSource.getRegisteredSources();
    VectorDataSource.clearRegisteredSources();
  `
  );
  return handlerPath;
}

if (
  !geoprocessing.preprocessingFunctions &&
  !geoprocessing.geoprocessingFunctions
) {
  throw new Error("No functions found in geoprocessing.json");
}

const handlerFunctions = [];
geoprocessing.preprocessingFunctions &&
  geoprocessing.preprocessingFunctions.forEach((funcPath) =>
    handlerFunctions.push(generateHandler(funcPath))
  );
geoprocessing.geoprocessingFunctions &&
  geoprocessing.geoprocessingFunctions.forEach((funcPath) =>
    handlerFunctions.push(generateHandler(funcPath))
  );

module.exports = {
  mode: "production",
  stats: {
    all: false,
    assets: true,
    warnings: true,
    errors: true,
    errorDetails: true,
  },
  entry: {
    ...handlerFunctions.reduce((handlerMapSoFar, handlerFunction) => {
      handlerMapSoFar[path.basename(handlerFunction)] = handlerFunction;
      return handlerMapSoFar;
    }, {}),
    serviceHandlers: path.join(GP_ROOT, "src/aws/serviceHandlers.ts"),
    sendmessage: path.join(GP_ROOT, "src/sockets/sendmessage.ts"),
    connect: path.join(GP_ROOT, "src/sockets/connect.ts"),
    disconnect: path.join(GP_ROOT, "src/sockets/disconnect.ts"),
  },
  output: {
    filename: (chunkData) => {
      if (/.ts$/.test(chunkData.chunk.name)) {
        return chunkData.chunk.name.replace(/.ts$/, ".js");
      } else {
        return "[name].js";
      }
    },
    path: path.join(GP_ROOT, ".build"),
    libraryTarget: "commonjs2",
  },
  target: "node",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [
      "node_modules", // search per default but add a couple more paths below
      path.resolve(__dirname, "../../node_modules"),
      path.join(PROJECT_PATH, "node_modules"),
    ],
  },
  plugins: [new ThreadsPlugin()].concat(
    process.env.ANALYZE_FUNCTIONS ? [new BundleAnalyzerPlugin()] : [] // conditionally include bundle analyzer
  ),
  performance: {
    maxAssetSize: 500000,
    maxEntrypointSize: 500000,
    hints: "warning",
  },
  externals: function (context, request, callback) {
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
                { targets: { node: "16" } },
              ],
              require.resolve("@babel/preset-typescript"),
            ],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator",
            ],
          },
        },
      },
    ],
  },
};

const staticExternals = ["aws-sdk", "aws-cdk-lib", "./manifest.json"];
const projectNodeModules = Object.keys(
  JSON.parse(
    fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
  ).dependencies || {}
);
const externals = [...staticExternals, ...projectNodeModules].filter(
  (n) => n !== "@seasketch/geoprocessing"
);

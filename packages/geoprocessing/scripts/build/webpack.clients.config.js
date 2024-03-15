import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackBundleAnalyzer from "webpack-bundle-analyzer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pathName = require.resolve("vue.runtime.esm.js");

const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin;

const PROJECT_PATH = process.env.PROJECT_PATH;
if (!PROJECT_PATH) {
  throw new Error("process.env.PROJECT_PATH not set");
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
);
const geoprocessing = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
);

if (!geoprocessing.clients && !geoprocessing.clients.length) {
  throw new Error("No clients found in geoprocessing.json");
}

let modulePaths = [
  path.resolve(__dirname, "../../node_modules"),
  path.join(PROJECT_PATH, "node_modules"),
];

// if monorepo environment, need to add top-level workspace node_modules path too
const topLevelNMPath = path.resolve(__dirname, "../../../../node_modules");
if (fs.existsSync(topLevelNMPath)) {
  modulePaths.push(topLevelNMPath);
}

console.log("modulePaths", modulePaths);

export default {
  mode: "production",
  entry: "./src/components/App.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "../../.build-web/"),
  },
  node: {
    fs: "empty",
  },
  stats: {
    all: false,
    assets: true,
    warnings: true,
    errors: true,
    errorDetails: true,
  },
  performance: {
    maxAssetSize: 300_000,
    maxEntrypointSize: 300_000,
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx"],
    modules: modulePaths,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      hash: true,
      template: path.resolve(__dirname, "index.html"),
    }),
    ...(process.env.ANALYZE_CLIENTS ? [new BundleAnalyzerPlugin()] : []),
  ],
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
                { debug: true, targets: ["> 0.25%", "not dead", "not IE 11"] },
              ],
              require.resolve("@babel/preset-typescript"),
              require.resolve("@babel/preset-react"),
            ],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator",
            ],
          },
        },
      },
      {
        test: /client-loader.js$/,
        use: [
          {
            loader: `val-loader`,
            options: {
              // bundle report clients (UI components) into array
              clients: geoprocessing.clients.map((c) => {
                c.source = path.join(PROJECT_PATH, c.source);
                return c;
              }),
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: true,
            },
          },
        ],
      },
    ],
  },
};

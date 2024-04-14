const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

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

module.exports = {
  mode: "production",
  devServer: {
    static: path.join(PROJECT_PATH, ".build-web"),
    compress: true,
    port: 8080,
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
  entry: "./src/components/App.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "../../.build-web/"),
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [
      path.resolve(import.meta.dirname, "../../node_modules"),
      path.join(PROJECT_PATH, "node_modules"),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name,
      hash: true,
      template: path.resolve(import.meta.dirname, "index.html"),
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
                { targets: { node: "14" } },
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
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};

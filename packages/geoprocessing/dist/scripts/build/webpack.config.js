"use strict";
const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PROJECT_PATH = process.env.PROJECT_PATH;
if (!PROJECT_PATH) {
    throw new Error("process.env.PROJECT_PATH not set");
}
// const manifest = JSON.parse(
//   fs.readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json")).toString()
// );
const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString());
const geoprocessing = JSON.parse(fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString());
if (!geoprocessing.clients && !geoprocessing.clients.length) {
    throw new Error("No clients found in geoprocessing.json");
}
const clientSources = geoprocessing.clients.map(c => path.resolve(path.join(PROJECT_PATH, c.source)));
module.exports = {
    // mode: "development",
    entry: "./src/components/App.tsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "../../.build-web/")
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [
            path.resolve(__dirname, "../../node_modules"),
            path.join(PROJECT_PATH, "node_modules")
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: pkg.name,
            hash: true,
            template: path.resolve(__dirname, "index.html")
        })
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
                                { targets: { node: "current" } }
                            ],
                            require.resolve("@babel/preset-typescript"),
                            require.resolve("@babel/preset-react")
                        ]
                    }
                }
            },
            {
                test: /client-loader.js$/,
                use: [
                    {
                        loader: `val-loader`,
                        options: {
                            clients: geoprocessing.clients.map(c => {
                                c.source = path.join(PROJECT_PATH, c.source);
                                return c;
                            })
                        }
                    }
                ]
            }
        ]
    }
};
//# sourceMappingURL=webpack.config.js.map
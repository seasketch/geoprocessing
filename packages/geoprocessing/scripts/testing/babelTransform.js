const babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  presets: [
    [require.resolve("@babel/preset-env"), { targets: { node: "current" } }],
    require.resolve("@babel/preset-typescript"),
  ],
  plugins: ["@babel/plugin-proposal-class-properties"],
  babelrc: false,
  configFile: false,
});

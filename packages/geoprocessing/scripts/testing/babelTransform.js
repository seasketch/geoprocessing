const babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  presets: [
    [require.resolve("@babel/preset-env"), { targets: { node: "current" } }],
    require.resolve("@babel/preset-typescript"),
  ],
  plugins: [require.resolve("@babel/plugin-transform-class-properties")],
  babelrc: false,
  configFile: false,
});

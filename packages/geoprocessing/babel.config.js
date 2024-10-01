/* eslint-disable unicorn/prefer-module */
module.exports = {
  presets: [
    [require.resolve("@babel/preset-env"), { targets: { node: "current" } }],
    require.resolve("@babel/preset-typescript"),
    require.resolve("@babel/preset-react"),
  ],
  plugins: [
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-syntax-import-attributes",
  ],
};

"use strict";
const babelJest = require("babel-jest");
module.exports = babelJest.createTransformer({
    presets: [
        [require.resolve("@babel/preset-env"), { targets: { node: "current" } }],
        require.resolve("@babel/preset-typescript")
    ],
    babelrc: false,
    configFile: false
});
//# sourceMappingURL=babelTransform.js.map
"use strict";
module.exports = {
    presets: [
        [require.resolve("@babel/preset-env"), { targets: { node: "current" } }],
        require.resolve("@babel/preset-typescript"),
        require.resolve("@babel/preset-react")
    ]
};
//# sourceMappingURL=babel.config.js.map
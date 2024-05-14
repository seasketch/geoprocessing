// This is solely used to support i18next-extract
// do not put anything in here that is not related to i18next-extract

const common = ["@babel/env"];
module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  plugins: [
    [
      "i18next-extract",
      {
        nsSeparator: ":",
        keySeparator: false,
        keyAsDefaultValue: ["en"],
        useI18nextDefaultValue: true,
        keyAsDefaultValueForDerivedKeys: true,
      },
    ],
    "@babel/plugin-syntax-import-attributes",
  ],
  overrides: [
    { test: /\.js$/, presets: common },
    { test: /\.jsx$/, presets: [...common, "@babel/react"] },
    { test: /\.ts$/, presets: [...common, "@babel/typescript"] },
    {
      test: /\.tsx$/,
      presets: [...common, "@babel/typescript", "@babel/react"],
    },
  ],
};

// override to behave like tsc and use right plugins for each extension - https://github.com/babel/babel/issues/6959#issuecomment-356769843

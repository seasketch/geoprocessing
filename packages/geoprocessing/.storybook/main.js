const path = require("path");
const { inspect } = require("util");

const baseStories = [
  "../src/**/*.stories.tsx",
  "../src/**/*.stories.js",
  "../src/**/*.stories.ts",
];

const projectStories = [];

if (process.env.PROJECT_PATH) {
  projectStories.push(
    path.join(process.env.PROJECT_PATH, "src/clients") + "/**/*.stories.tsx"
  );
  projectStories.push(
    path.join(process.env.PROJECT_PATH, "src/components") + "/**/*.stories.tsx"
  );
}

module.exports = {
  stories: [...baseStories, ...projectStories],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "none",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => {
    config.node = { fs: "empty" };
    if (process.env.PROJECT_PATH) {
      config.module.rules.push({
        test: /storybook\/examples-loader.js$/,
        use: [
          {
            loader: `val-loader`,
            options: {
              examplesPath: path.join(process.env.PROJECT_PATH, "examples"),
            },
          },
        ],
      });
    }
    return config;
  },
};

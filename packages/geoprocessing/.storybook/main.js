const path = require("path");
const fs = require("fs");

const baseStories = [
  "../src/**/*.stories.tsx",
  "../src/**/*.stories.js",
  "../src/**/*.stories.ts",
];

const projectStories = [];

if (process.env.PROJECT_PATH) {
  if (fs.existsSync(path.join(process.env.PROJECT_PATH, "src/clients"))) {
    console.log("Clients path found, adding to stories");
    projectStories.push(
      path.join(process.env.PROJECT_PATH, "src/clients") + "/**/*.stories.tsx"
    );
  } else {
    console.log("Clients path not found, skipping");
  }
  if (fs.existsSync(path.join(process.env.PROJECT_PATH, "src/components"))) {
    console.log("Components path found, adding to stories");
    projectStories.push(
      path.join(process.env.PROJECT_PATH, "src/components") +
        "/**/*.stories.tsx"
    );
  } else {
    console.log("Components path not found, skipping");
  }
}

module.exports = {
  stories: [...baseStories, ...projectStories],
  addons: [
    "@storybook/addon-actions", // Fixes issue running storybook in devcontainer https://github.com/storybookjs/storybook/issues/17996
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack4",
  },
  features: {
    postcss: false,
  },
  typescript: {
    check: true,
    reactDocgen: "none",
  },
  webpackFinal: async (config) => {
    /// stub fs to avoid not found error
    // webpack 5 only, enable when webpack 5 works
    // config.resolve.fallback.fs = false;
    // webpack 4 only, disable when webpack 4 dropped
    config.node = { fs: "empty" };

    // allow ts files to be picked up in project path
    config.resolve.extensions.push(".ts", ".tsx");
    // configure ts files in project path to be transpiled too
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          // bab
          loader: require.resolve("babel-loader"),
          options: {
            plugins: [
              "@babel/plugin-proposal-numeric-separator",
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator",
            ],
          },
        },
      ],
    });
    // load project example sketches and smoke test output
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

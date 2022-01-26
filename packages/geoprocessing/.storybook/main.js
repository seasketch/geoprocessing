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
  addons: [
    {
      name: "storybook-addon-turbo-build",
      options: {
        // Please refer below tables for available options
        optimizationLevel: 3,
      },
    },
  ],
  typescript: {
    reactDocgen: "none",
  },
  webpackFinal: async (config) => {
    config.node = {
      fs: "empty",
    };
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
        },
        // // Optional
        // {
        //   loader: require.resolve('react-docgen-typescript-loader'),
        // },
      ],
    });
    config.resolve.extensions.push(".ts", ".tsx");
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

    config.plugins = config.plugins.filter(
      (p) =>
        !inspect(p).match(
          /^(DocgenPlugin|ESLintWebpackPlugin|ForkTsCheckerWebpackPlugin)/
        )
    );

    console.log(process.cwd());
    return config;
  },
};

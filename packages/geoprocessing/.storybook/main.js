const path = require("path");

const baseStories = [
  "../src/**/*.stories.tsx",
  "../src/**/*.stories.js",
  "../src/**/*.stories.ts"
];

const projectStories = [];

if (process.env.PROJECT_PATH) {
  projectStories.push(
    path.join(process.env.PROJECT_PATH, "src/clients") + "/**/*.stories.tsx"
  );
}

module.exports = {
  stories: [...baseStories, ...projectStories],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader")
        }
        // // Optional
        // {
        //   loader: require.resolve('react-docgen-typescript-loader'),
        // },
      ]
    });
    config.resolve.extensions.push(".ts", ".tsx");
    if (process.env.PROJECT_PATH) {
      config.module.rules.push({
        test: /examples-loader.js$/,
        use: [
          {
            loader: `val-loader`,
            options: {
              examplesPath: path.join(process.env.PROJECT_PATH, "examples")
            }
          }
        ]
      });
    }

    console.log(process.cwd());
    return config;
  }
};

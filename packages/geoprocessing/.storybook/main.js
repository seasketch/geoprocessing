module.exports = {
  stories: [
    "../src/**/*.stories.tsx",
    "../src/**/*.stories.js",
    "../src/**/*.stories.ts"
  ],
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
    return config;
  }
};

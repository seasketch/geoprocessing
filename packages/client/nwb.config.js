module.exports = {
  type: 'react-component',
  npm: {
      cjs: false,
      esModules: false,
      umd: false
  },
  polyfill: false,
  webpack: {
      config(config) {
          config.entry = {
              index: ["./src/index.js"]
          }
          // config.resolve.extensions.push(".ts", ".tsx");
          config.module.rules.push({
              "test": /\.tsx?$/,
              "loader": "ts-loader"
          });

          return config;
      }
  }
}
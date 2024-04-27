import type { StorybookConfig } from "@storybook/react-webpack5";

import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    const customConfig = { ...config };
    customConfig.module = customConfig.module || {};
    customConfig.module.rules = customConfig.module.rules || [];
    // customConfig.module.rules.push({
    //   test: {},
    //   resolve: {
    //     fullySpecified: false,
    //   },
    // });
    //@ts-ignore
    customConfig.module.rules[11].resolve = {
      fullySpecified: true,
    };
    //@ts-ignore
    customConfig.module.rules[2].resolve = {
      fullySpecified: true,
    };
    //@ts-ignore
    customConfig.module.rules[10].resolve = {
      fullySpecified: true,
    };
    // customConfig.module.rules.push({
    //   test: /\.tsx?$/,
    //   use: "ts-loader",
    //   exclude: /node_modules/,
    // });
    customConfig.resolve = customConfig.resolve || {};
    customConfig.resolve.extensionAlias = {
      ".js": [".ts", ".js"],
      ".mjs": [".mts", ".mjs"],
    };
    // customConfig.experiments.outputModule = true;
    console.log(JSON.stringify(config, null, 2));
    return customConfig;
  },
};
export default config;

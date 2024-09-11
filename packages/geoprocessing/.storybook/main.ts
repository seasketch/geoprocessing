import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return path.dirname(require.resolve(path.join(value, "package.json")));
}

const storyPaths = ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"];

const config: StorybookConfig = {
  stories: storyPaths,
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),

    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;

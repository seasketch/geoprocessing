import type { StorybookConfig } from "@storybook/react-vite";

const storyPaths = [
  `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)`,
  `../src/**/.story-cache/*.stories.@(js|jsx|mjs|ts|tsx)`,
];

const config: StorybookConfig = {
  stories: storyPaths,
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    builder: {
      name: "@storybook/builder-vite",
      options: {
        viteConfigPath: "./.storybook/vite.config.ts",
      },
    },
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: false,
  },
};
export default config;

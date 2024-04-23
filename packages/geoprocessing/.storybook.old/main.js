import path from "path";
import fs from "fs";

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
    builder: "@storybook/builder-vite",
  },
  features: {
    postcss: false,
  },
  typescript: {
    check: true,
    reactDocgen: "none",
  },
};

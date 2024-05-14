import type { StorybookConfig } from "@storybook/react-vite";

import path from "path";
import fs from "fs";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return path.dirname(require.resolve(path.join(value, "package.json")));
}

const storyPaths = ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"];

// Not currently used, project space responsible for its own storybook+vite setup

// if (process.env.PROJECT_PATH) {
//   // Add project stories to search path
//   if (fs.existsSync(path.join(process.env.PROJECT_PATH, "src/clients"))) {
//     console.log("Clients path found (src/clients), adding to stories");
//     storyPaths.push(
//       `${path.join(process.env.PROJECT_PATH, "src/clients")}/**/*.stories.tsx`
//     );
//     storyPaths.push(
//       `${path.join(process.env.PROJECT_PATH, "src/clients")}/**/.story-cache/*.stories.@(js|jsx|mjs|ts|tsx)`
//     );
//   } else {
//     console.log("Clients path not found (src/clients), skipping");
//   }
//   if (fs.existsSync(path.join(process.env.PROJECT_PATH, "src/components"))) {
//     console.log("Components path found (src/components), adding to stories");
//     storyPaths.push(
//       path.join(process.env.PROJECT_PATH, "src/components") +
//         "/**/*.stories.tsx"
//     );
//     storyPaths.push(
//       `${path.join(process.env.PROJECT_PATH, "src/components")}/**/.story-cache/*.stories.@(js|jsx|mjs|ts|tsx)`
//     );
//   } else {
//     console.log("Components path not found (src/components), skipping");
//   }
// }

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
  docs: {
    autodocs: "tag",
  },
};
export default config;

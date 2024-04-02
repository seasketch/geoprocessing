import { parseCLI, startVitest } from "vitest/node";
import { configDefaults } from "vitest/config";

/**
 * Manually parse user-provided CLI arguments from geoprocessing test command and run vitest
 */
export default async function () {
  // build vitest command from user-provided arguments, then parse it
  const argv = ["vitest", ...process.argv.slice(2)];
  const { filter, options } = parseCLI(argv);

  // Default to jsdom env, user can override to node environment in test files
  const testOptions = {
    root: process.env.TEST_ROOT,
    exclude: [...configDefaults.exclude],
    environment: "jsdom",
    globals: true,
    run: true,
    passWithNoTests: true,
    ...options, // merge user-provided options
  };

  startVitest("test", filter, testOptions);
}

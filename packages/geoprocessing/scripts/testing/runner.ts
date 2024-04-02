import { parseCLI, startVitest } from "vitest/node";
import { configDefaults } from "vitest/config";

/**
 * Manually parse user-provided CLI arguments from geoprocessing test command and run vitest
 */
export default async function () {
  // build vitest command from user-provided arguments after "--"
  const argv = ["vitest", ...process.argv.slice(2)];
  const { filter, options } = parseCLI(argv);

  const defaultOptions = {
    root: process.env.TEST_ROOT,
    exclude: [...configDefaults.exclude],
    environment: "jsdom",
    globals: true,
    run: true,
    passWithNoTests: true,
  };

  startVitest("test", filter, { ...defaultOptions, ...options });
}

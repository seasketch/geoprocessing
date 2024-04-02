import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCLI, startVitest } from "vitest/node";
import { configDefaults } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function () {
  // build vitest command, adding user-provided arguments after "--"
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

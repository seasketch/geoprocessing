import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCLI, startVitest } from "vitest/node";
import { configDefaults } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function () {
  const argv = ["vitest", ...process.argv.slice(2)];
  console.log("dirname", __dirname);
  console.log("args", JSON.stringify(argv));
  console.log("process.env", process.env.TEST_ROOT);

  const { filter, options } = parseCLI(argv);

  const defaultOptions = {
    name: "node-tests",
    root: process.env.TEST_ROOT,
    exclude: [...configDefaults.exclude],
    environment: "jsdom",
    globals: true,
  };

  startVitest("test", filter, { ...defaultOptions, ...options });
}

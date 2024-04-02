import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCLI, startVitest } from "vitest/node";
import { configDefaults } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function () {
  const argv = process.argv.slice(2);
  console.log("dirname", __dirname);
  console.log("args", JSON.stringify(argv));
  console.log("process.env", process.env.VITE_TEST_DIR);

  const { filter, options } = parseCLI(argv);

  const defaultOptions = {
    name: "node-tests",
    root: process.env.VITE_TEST_DIR,
    exclude: [...configDefaults.exclude],
    environment: "jsdom",
    globals: true,
  };

  startVitest("test", filter, options);
}

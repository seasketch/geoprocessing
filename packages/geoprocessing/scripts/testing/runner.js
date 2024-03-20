// copied and modified from create-react-app
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/test.js
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseCLI, startVitest } from "vitest/node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function () {
  console.log("dirname", __dirname);
  console.log("env", JSON.stringify(process.env));
  console.log("argv", JSON.stringify(process.argv));

  let argv = process.argv.slice(2);
  argv.push("-r", `${__dirname}`);

  const { cliFilters, cliOptions } = parseCLI(process.argv);

  // HOW TO FIND SETUPFILES???????????????????  GP_PATH???
  const defaultOptions = {
    name: "node-tests",
    root: import.meta.env.VITE_SOME_KEY,
    //include: ["**/*.{test}.?(c|m)[jt]s?(x)"],
    exclude: [...configDefaults.exclude],
    environment: "node",
    globals: true,
    // setupFiles: ["./vitest-setup.ts"],
  };

  startVitest("test", cliFilters, cliOptions);
  await vitest?.close();
}

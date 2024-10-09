import { program } from "commander";
import { init } from "./init.js";

program
  .command("init")
  .option(
    "--gpVersion <string>",
    "Git supported version string to install.  Can be local file url",
  )
  .action(async function (options) {
    try {
      await init(options.gpVersion);
    } catch (error) {
      console.log("\n");
      console.error(error);
      process.exit(1);
    }
  });

console.log("process.argv", JSON.stringify(process.argv, null, 2));
program.parse(process.argv);

import { program } from "commander";
import { init } from "./init.js";

program
  .command("init")
  .option(
    "--gpVersion <string>",
    "Git supported version string to install.  Can be local file url",
    undefined
  )
  .action(async function (options) {
    try {
      await init(options.gpVersion);
    } catch (e) {
      console.log("\n");
      console.error(e);
      process.exit(1);
    }
  });

program.parse(process.argv);

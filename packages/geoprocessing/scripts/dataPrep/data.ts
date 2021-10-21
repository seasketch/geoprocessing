import program from "commander";
import { areaByClass } from "./areaByClass";

program
  .command("areaByClass <inFile> <outFile> <classProperty>")
  .description(
    "calculate area stats, stratified by class for given geojson feature collection",
    {
      inFile: "path to geojson file with polygon feature collection",
      outFile: "path to area stats JSON file to output",
      classProperty: "name of property with class values",
    }
  )
  .action(async function (inFile, outFile, classProperty) {
    try {
      console.log("got here");
      console.log("args", inFile, outFile, classProperty);
      await areaByClass(inFile, outFile, classProperty);
    } catch (e) {
      console.log("\n");
      console.error(e);
      process.exit(1);
    }
  });

program.parse(process.argv);

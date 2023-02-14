import fs from "fs-extra";

/**
 * Writes the output of running a function with a sketch to file
 */
export async function writeResultOutput(
  results: any,
  functionName: string,
  sketchName: string
) {
  if (!fs.existsSync("examples/output")) {
    await fs.mkdir("examples/output");
  }
  const folder = "examples/output/" + sketchName;
  if (!fs.existsSync(folder)) {
    await fs.mkdir(folder);
  }
  fs.writeFile(
    folder + "/" + functionName + ".json",
    JSON.stringify(results, null, "  ")
  );
}

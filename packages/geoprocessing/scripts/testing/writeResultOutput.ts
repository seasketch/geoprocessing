import fs from "fs-extra";

/**
 * Writes the output of running a function with a sketch to file
 */
export async function writeResultOutput(
  results: any,
  functionName: string,
  name: string,
) {
  if (!fs.existsSync("examples/output")) {
    await fs.mkdir("examples/output");
  }
  const folder = "examples/output/" + name;
  if (!fs.existsSync(folder)) {
    await fs.mkdir(folder);
  }
  fs.writeFile(
    folder + "/" + functionName + ".json",
    JSON.stringify(results, null, "  "),
  );
}

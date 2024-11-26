import fs from "fs-extra";

/**
 * Writes the output of running a function with a sketch to file
 */
export async function writeResultOutput(
  results: any,
  functionName: string,
  name: string,
) {
  const folder = "examples/output/" + name;
  await fs.ensureDirSync(folder);

  fs.writeFile(
    folder + "/" + functionName + ".json",
    JSON.stringify(results, null, "  "),
  );
}

/**
 * @group smoke
 */
import { buildFileIndex } from "../buildFileIndex";
import fs, { PathLike } from "fs";
import path from "path";

function getFilesFromPath(path: PathLike, extension: string) {
  let files = fs.readdirSync(path);
  return files.filter((file) =>
    file.match(new RegExp(`.*\.(${extension})`, "ig"))
  );
}

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof buildFileIndex).toBe("function");
  });
  test("buildFileIndex - runs with all test inputs", async () => {
    const inPath = path.join(__dirname, "in");
    const inFiles = getFilesFromPath(inPath, ".geojson");
    for (const inFile of inFiles) {
      const inFilePath = path.join(inPath, inFile);
      console.log("infile", inFilePath);
      const result = buildFileIndex(inFilePath, "./out", {
        resolutions: [8],
        numClasses: 20,
      });
      expect(result).toBeTruthy();
    }
  });
});

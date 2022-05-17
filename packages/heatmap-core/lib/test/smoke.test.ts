/**
 * @group smoke
 */
import { buildIndex } from "../buildIndex";
import fs, { PathLike } from "fs";
import path from "path";

function getFilesFromPath(path: PathLike, extension: string) {
  let files = fs.readdirSync(path);
  return files.filter((file) =>
    file.match(new RegExp(`.*\.(${extension})$`, "ig"))
  );
}

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof buildIndex).toBe("function");
  });
  test("buildIndex - runs with all test inputs", async () => {
    const inPath = path.join(__dirname, "in");
    const inFiles = getFilesFromPath(inPath, ".geojson");
    for (const inFile of inFiles) {
      const fc = JSON.parse(
        fs.readFileSync(path.join(inPath, inFile)).toString()
      );
      console.log("numShapes", fc.features.length);
      const result = buildIndex(fc, {
        resolutions: [8, 9],
        numClasses: 20,
      });
      console.log("result", result);
      expect(result).toBeTruthy();
    }
  });
});

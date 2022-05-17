import { buildFileIndex } from "./buildFileIndex";
import process from "process";

test("buildIndex - single polygon", () => {
  console.log("cwd", process.cwd());
  const result = buildFileIndex("./fixtures/test_input.geojson", "./output");
  console.log(result);
  expect(result).toBeTruthy();
}, 5000);

/**
 * @group smoke
 */
import Handler from "./areaAsync";
import {
  getExampleSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

const areaAsync = Handler.func;

describe("areaAsyncSmoke", () => {
  test("handler function is present", () => {
    expect(typeof areaAsync).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExampleSketches();
    for (const example of examples) {
      const result = await areaAsync(example);
      console.log("output result: ", result);
      expect(result).toBeTruthy();
      writeResultOutput(result, "areaAsync", example.properties.name);
    }
  });
});

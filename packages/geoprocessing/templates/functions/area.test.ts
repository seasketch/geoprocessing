import Handler from "./area";
import {
  getExampleSketches,
  writeResultOutput
} from "@seasketch/geoprocessing";

const calculateArea = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof calculateArea).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExampleSketches();
    for (const example of examples) {
      const result = await calculateArea(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "calculateArea", example.properties.name);
    }
  });
});

describe("Unit tests", () => {
  test("Area should be > 700 sq km", async () => {
    const examples = await getExampleSketches();
    const result = await calculateArea(examples[0]);
    expect(result.area / 1000 ** 2).toBeGreaterThan(700);
  });
});

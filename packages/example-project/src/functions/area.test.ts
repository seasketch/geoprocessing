import Handler from "./area";
import {
  getExampleSketches,
  writeResultOutput
} from "@seasketch/geoprocessing";

const area = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof area).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExampleSketches();
    for (const example of examples) {
      const result = await area(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "area", example.properties.name);
    }
  });
});

describe("Unit tests", () => {
  test("Area should be > 700 sq km", async () => {
    const examples = await getExampleSketches();
    const result = await area(examples[0]);
    expect(result.area / 1000 ** 2).toBeGreaterThan(700);
  });
});

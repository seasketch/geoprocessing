import Handler from "./test";
import {
  getExampleSketches,
  writeResultOutput
} from "@seasketch/geoprocessing";

const test = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof test).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExampleSketches();
    for (const example of examples) {
      const result = test(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "calc", example.properties.name);
    }
  });
});

describe("Unit tests", () => {
  test("Area should be > 700 sq km", async () => {
    const examples = await getExampleSketches();
    const result = await test(examples[0]);
    expect(result.area / 1000 ** 2).toBeGreaterThan(700);
  });
});

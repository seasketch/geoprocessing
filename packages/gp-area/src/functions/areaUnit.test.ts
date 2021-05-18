/**
 * @group unit
 */
import Handler from "./area";
import {
  getExampleSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

const area = Handler.func;

describe("Unit tests", () => {
  test("Area should be > 700 sq km", async () => {
    const examples = await getExampleSketches("gpArea");
    const result = await area(examples[0]);
    expect(result.area / 1000 ** 2).toBeGreaterThan(10);
  });
});

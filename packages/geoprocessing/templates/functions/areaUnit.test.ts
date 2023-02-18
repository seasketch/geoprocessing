/**
 * @group unit
 */
import Handler from "./area";
import {
  getExampleSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

const calculateArea = Handler.func;

describe("Unit tests", () => {
  test("Area should be > 1 sq km", async () => {
    const examples = await getExampleSketches();
    const result = await calculateArea(examples[0]);
    expect(result.area / 1000 ** 2).toBeGreaterThan(1);
  });
});

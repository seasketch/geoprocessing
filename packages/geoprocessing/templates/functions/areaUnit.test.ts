/**
 * @group unit
 */
import { calculateArea } from "./area";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Unit tests", () => {
  test("Area should be > 700 sq km", async () => {
    const examples = await getExamplePolygonSketchAll();
    const result = await calculateArea(examples[0]);
    expect(result.area / 1000 ** 2).toBeGreaterThan(700);
  });
});

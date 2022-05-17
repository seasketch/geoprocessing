/**
 * @group unit
 */

import { buildIndex } from "./buildIndex";
import { polygon, featureCollection } from "@turf/helpers";

// geometry is a rectangle that is 100m x 200m = 20,000m^2 area
const poly = polygon(
  [
    [
      [0, 0],
      [0, 0.001],
      [0.002, 0.001],
      [0.002, 0],
      [0, 0],
    ],
  ],
  {
    importance: 10,
  }
);
const importance = 20;
const polyFC = featureCollection([poly]);

test("buildIndex - single polygon", () => {
  const result = buildIndex(polyFC, { resolutions: [8], numClasses: 20 });
  console.log(result);
  expect(result).toBeTruthy();
  expect(result.index.length).toEqual(4);
  expect(result.meta.numClasses).toEqual(20);
  expect(Object.keys(result.meta.resolutions).length).toEqual(4);
});

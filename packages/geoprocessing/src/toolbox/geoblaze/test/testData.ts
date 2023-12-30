/**
 * @jest-environment node
 * @group e2e
 */
import { Polygon, Sketch } from "../../../types";
import { genSampleSketch } from "../../../helpers";

// bbox  - [xmin, ymin, xmax, ymax]
// pixel - [left, bottom, right, top]

export const quad1Poly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [-2, 2],
      [-2, 18],
      [-18, 18],
      [-18, 2],
      [-2, 2],
    ],
  ],
});

export const quad2Poly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, 2],
      [2, 18],
      [18, 18],
      [18, 2],
      [2, 2],
    ],
  ],
});

export const allQuadPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [-18, -18],
      [-18, 18],
      [18, 18],
      [18, -18],
      [-18, -18],
    ],
  ],
});

export const outsideQuadPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [30, 30],
      [30, 50],
      [50, 50],
      [50, 30],
      [30, 30],
    ],
  ],
});

export default {
  quad1Poly,
  quad2Poly,
  allQuadPoly,
  outsideQuadPoly,
};

import {
  Polygon,
  Sketch,
  MultiPolygon,
  SketchCollection,
  FeatureCollection,
} from "../../types";
import {
  genSampleSketch,
  genSampleSketchCollection,
  genSampleSketchCollectionFromSketches,
} from "../../helpers";

const outer: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [0, 20],
      [20, 20],
      [20, 0],
      [0, 0],
    ],
  ],
});

const bottomLeftPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, 2],
      [2, 8],
      [8, 8],
      [8, 2],
      [2, 2],
    ],
  ],
});

const topRightPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [12, 12],
      [12, 18],
      [18, 18],
      [18, 12],
      [12, 12],
    ],
  ],
});

const twoPolyInsideFC: FeatureCollection<MultiPolygon | Polygon> = {
  type: "FeatureCollection",
  features: [bottomLeftPoly, topRightPoly],
};

const twoPolyInsideSC: SketchCollection<MultiPolygon | Polygon> =
  genSampleSketchCollection(twoPolyInsideFC);

const wholePoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, 2],
      [2, 20],
      [20, 20],
      [20, 2],
      [2, 2],
    ],
  ],
});

const wholeMultipoly: Sketch<MultiPolygon> = genSampleSketch({
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [2, 2],
        [2, 20],
        [20, 20],
        [20, 2],
        [2, 2],
      ],
    ],
  ],
});

const wholeMixedFC: FeatureCollection<MultiPolygon | Polygon> = {
  type: "FeatureCollection",
  features: [wholePoly, wholeMultipoly],
};

const wholeMixedSC: SketchCollection<MultiPolygon | Polygon> =
  genSampleSketchCollection(wholeMixedFC);

// hole in bottom left
const holeBlPoly: Sketch<Polygon> = genSampleSketch(
  {
    type: "Polygon",
    coordinates: [
      [
        [2, 2],
        [2, 20],
        [20, 20],
        [20, 2],
        [2, 2],
      ],
      [
        [2, 2],
        [2, 8],
        [8, 8],
        [8, 2],
        [2, 2],
      ],
    ],
  },
  "holeBotLeft"
);

// hole in top right
const holeTrMultipoly: Sketch<MultiPolygon> = genSampleSketch(
  {
    type: "MultiPolygon",
    coordinates: [
      [
        [
          [2, 2],
          [2, 20],
          [20, 20],
          [20, 2],
          [2, 2],
        ],
        [
          [12, 12],
          [12, 18],
          [18, 18],
          [18, 12],
          [12, 12],
        ],
      ],
    ],
  },
  "holeTopRight"
);

/**
 * Sketch collection with a whole polygon with a hole in the bottom left and a whole multipolygon with a hole in the top-right
 * These two features have 100% overlap except for their holes which don't overlap at all.
 */
const holeMixedSC: SketchCollection<MultiPolygon | Polygon> =
  genSampleSketchCollectionFromSketches<Polygon | MultiPolygon>(
    [holeBlPoly, holeTrMultipoly],
    "holeSC"
  );

export default {
  outer,
  bottomLeftPoly,
  topRightPoly,
  twoPolyInsideFC,
  twoPolyInsideSC,
  wholePoly,
  wholeMultipoly,
  wholeMixedFC,
  wholeMixedSC,
  holeBlPoly,
  holeTrMultipoly,
  holeMixedSC,
};

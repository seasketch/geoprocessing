import {
  SketchCollection,
  Feature,
  MultiPolygon,
  Polygon,
} from "../../types/index.js";
import { genSampleSketch } from "../../helpers/index.js";
import {
  feature,
  featureCollection,
  multiPolygon,
  polygon,
  area,
  bbox,
} from "@turf/turf";

const tiny: Feature<Polygon> = feature({
  type: "Polygon",
  coordinates: [
    [
      [0.000_001, 0.000_001],
      [0.000_002, 0.000_001],
      [0.000_002, 0.000_002],
      [0.000_001, 0.000_002],
      [0.000_001, 0.000_001],
    ],
  ],
});

const twoByPoly: Feature<Polygon> = feature({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ],
  ],
});
const twoByPolyArea = area(twoByPoly);

const fourByPoly: Feature<Polygon> = feature({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [4, 0],
      [4, 4],
      [0, 4],
      [0, 0],
    ],
  ],
});
const fourByPolyArea = area(fourByPoly);

// fully inside outer
const insideTwoByPoly = polygon([
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
]);

const insideTwoByMultiPoly = multiPolygon([
  insideTwoByPoly.geometry.coordinates,
]);
const insideTwoByMultipolySketch = genSampleSketch(
  insideTwoByMultiPoly.geometry,
  "sketchMultiPoly1",
);

const insideTwoByPolySketch = genSampleSketch(
  insideTwoByPoly.geometry,
  "sketch1",
);

// half inside outer
const halfInsideTwoByPoly = polygon([
  [
    [1, 1],
    [3, 1],
    [3, 2],
    [1, 2],
    [1, 1],
  ],
]);
const fullyInsideTwoPoly = polygon([
  [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 1],
  ],
]);
const halfInsideTwoBySketchPoly = genSampleSketch(
  halfInsideTwoByPoly.geometry,
  "sketch2",
);

// fully outside outer top right
const outsideTwoByPolyTopRight = polygon([
  [
    [3, 3],
    [4, 3],
    [4, 4],
    [3, 4],
    [3, 3],
  ],
]);
const outsideTwoByPolyTopRightSketch = genSampleSketch(
  outsideTwoByPolyTopRight.geometry,
  "sketch3",
);

// fully outside outer bottom right
const outsideTwoByPolyBottomRight = polygon([
  [
    [3, 0],
    [4, 0],
    [4, 1],
    [3, 1],
    [3, 0],
  ],
]);
const outsideTwoByPolyBottomRightSketch = genSampleSketch(
  outsideTwoByPolyBottomRight.geometry,
  "outsideTwoByPolyBottomRight",
);

// fully outside outer bottom right
const outsideTwoByPolyTopLeft = polygon([
  [
    [0, 3],
    [1, 3],
    [1, 4],
    [0, 4],
    [0, 3],
  ],
]);
const outsideTwoByPolyTopLeftSketch = genSampleSketch(
  outsideTwoByPolyTopLeft.geometry,
  "outsideTwoByPolyTopLeft",
);

const collectionId = "CCCC";
const sketchCollection: SketchCollection<Polygon> = {
  type: "FeatureCollection",
  properties: {
    id: collectionId,
    name: "Collection 1",
    updatedAt: "2021-11-20T00:00:34.269Z",
    createdAt: "2021-11-19T23:34:12.889Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: true,
    userAttributes: [],
  },
  bbox: bbox(
    featureCollection([
      insideTwoByPolySketch,
      halfInsideTwoBySketchPoly,
      outsideTwoByPolyTopRightSketch,
    ]),
  ),
  features: [
    insideTwoByPolySketch,
    halfInsideTwoBySketchPoly,
    outsideTwoByPolyTopRightSketch,
  ],
};

const mixedCollectionId = "MMMM";
const mixedPolySketchCollection: SketchCollection<Polygon | MultiPolygon> = {
  type: "FeatureCollection",
  properties: {
    id: mixedCollectionId,
    name: "Collection 1",
    updatedAt: "2021-11-20T00:00:34.269Z",
    createdAt: "2021-11-19T23:34:12.889Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: true,
    userAttributes: [],
  },
  bbox: bbox(
    featureCollection<Polygon | MultiPolygon>([
      insideTwoByPolySketch,
      insideTwoByMultiPoly,
    ]),
  ),
  features: [insideTwoByPolySketch, insideTwoByMultipolySketch],
};

const scArea = area(sketchCollection);

/** 2nd and 3rd sketches are the same */
const overlapCollection: SketchCollection<Polygon> = {
  type: "FeatureCollection",
  properties: {
    id: collectionId,
    name: "Collection 1",
    updatedAt: "2021-11-20T00:00:34.269Z",
    createdAt: "2021-11-19T23:34:12.889Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: true,
    userAttributes: [],
  },
  bbox: bbox(
    featureCollection([insideTwoByPolySketch, halfInsideTwoBySketchPoly]),
  ),
  features: [
    insideTwoByPolySketch,
    halfInsideTwoBySketchPoly,
    halfInsideTwoBySketchPoly,
  ],
};

export default {
  tiny,
  twoByPoly,
  twoByPolyArea,
  fourByPoly,
  fourByPolyArea,
  insideTwoByPoly,
  insideTwoByMultiPoly,
  insideTwoByPolySketch,
  insideTwoByMultipolySketch,
  halfInsideTwoByPoly,
  fullyInsideTwoPoly,
  halfInsideTwoBySketchPoly,
  outsideTwoByPolyTopRight,
  outsideTwoByPolyTopRightSketch,
  outsideTwoByPolyBottomRight,
  outsideTwoByPolyBottomRightSketch,
  outsideTwoByPolyTopLeft,
  outsideTwoByPolyTopLeftSketch,
  collectionId,
  mixedCollectionId,
  sketchCollection,
  mixedPolySketchCollection,
  overlapCollection,
  scArea,
};

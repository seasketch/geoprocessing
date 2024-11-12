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

const outer: Feature<Polygon> = feature({
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
const outerArea = area(outer);

const outerOuter: Feature<Polygon> = feature({
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
const outerOuterArea = area(outerOuter);

// fully inside outer
const poly1 = polygon([
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
]);

const multiPoly1 = multiPolygon([poly1.geometry.coordinates]);
const sketchMultiPoly1 = genSampleSketch(
  multiPoly1.geometry,
  "sketchMultiPoly1",
);

const sketch1 = genSampleSketch(poly1.geometry, "sketch1");

// half inside outer
const poly2 = polygon([
  [
    [1, 1],
    [3, 1],
    [3, 2],
    [1, 2],
    [1, 1],
  ],
]);
const poly2Inner = polygon([
  [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 1],
  ],
]);
const sketch2 = genSampleSketch(poly2.geometry, "sketch2");

// fully outside outer
const poly3 = polygon([
  [
    [3, 3],
    [4, 3],
    [4, 4],
    [3, 4],
    [3, 3],
  ],
]);
const sketch3 = genSampleSketch(poly3.geometry, "sketch3");

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
  bbox: bbox(featureCollection([sketch1, sketch2, sketch3])),
  features: [sketch1, sketch2, sketch3],
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
  bbox: bbox(featureCollection<Polygon | MultiPolygon>([sketch1, multiPoly1])),
  features: [sketch1, sketchMultiPoly1],
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
  bbox: bbox(featureCollection([sketch1, sketch2])),
  features: [sketch1, sketch2, sketch2],
};

export default {
  tiny,
  outer,
  outerArea,
  outerOuterArea,
  poly1,
  multiPoly1,
  sketch1,
  sketchMultiPoly1,
  poly2,
  poly2Inner,
  sketch2,
  poly3,
  sketch3,
  collectionId,
  mixedCollectionId,
  sketchCollection,
  mixedPolySketchCollection,
  overlapCollection,
  scArea,
};

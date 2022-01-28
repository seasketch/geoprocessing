import { SketchCollection } from "../../types";
import { genSampleSketch } from "../../helpers";
import {
  feature,
  Feature,
  featureCollection,
  Polygon,
  polygon,
} from "@turf/helpers";
import area from "@turf/area";
import bbox from "@turf/bbox";

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

// full inside outer
const poly1 = polygon([
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
]);

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

const scArea = area(sketchCollection);

export default {
  outer,
  outerArea,
  outerOuterArea,
  poly1,
  sketch1,
  poly2,
  sketch2,
  poly3,
  sketch3,
  collectionId,
  sketchCollection,
  scArea,
};

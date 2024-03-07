import { feature } from "@turf/helpers";
import { Feature, Polygon } from "../../types/geojson.js";
import { genSampleSketch } from "../../helpers/index.js";

export const selfCrossingPolygon: Feature<Polygon> = feature({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
      [0, 0],
    ],
  ],
});

export const selfCrossingSketchPolygon = genSampleSketch(
  selfCrossingPolygon.geometry,
  "selfCrossingPolygon"
);

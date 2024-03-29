import { feature, Feature, Polygon } from "@turf/helpers";
import { genSampleSketch } from "../../helpers";

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

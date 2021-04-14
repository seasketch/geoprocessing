import {
  ValidationError,
  PreprocessingHandler,
} from "@seasketch/geoprocessing";
import area from "@turf/area";
import bboxClip from "@turf/bbox-clip";
import { Feature, BBox, Polygon } from "geojson";

// Covers California Channel Islands, change as needed to meet your needs using bboxfinder.com
const bounds: BBox = [-120.652, 33.733, -119.279, 34.225];

async function clipToBounds(feature: Feature): Promise<Feature> {
  if (!isPolygon(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  const clipped = bboxClip(feature, bounds);
  if (area(clipped) === 0) {
    throw new ValidationError("Sketch is outside of project boundaries");
  } else {
    return clipped as Feature<Polygon>;
  }
}

export default new PreprocessingHandler(clipToBounds, {
  title: "clipToBounds",
  description: "Example-description",
  timeout: 1,
  requiresProperties: [],
});

function isPolygon(feature: Feature): feature is Feature<Polygon> {
  return feature.geometry.type === "Polygon";
}

import {
  ValidationError,
  PreprocessingHandler,
  Feature,
  BBox,
  Polygon,
  isPolygonFeature,
} from "@seasketch/geoprocessing";
import area from "@turf/area";
import bboxClip from "@turf/bbox-clip";

// Covers California Channel Islands, change as needed to meet your needs using bboxfinder.com
const bounds: BBox = [-120.652, 33.733, -119.279, 34.225];

export async function clipToBounds(feature: Feature): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
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

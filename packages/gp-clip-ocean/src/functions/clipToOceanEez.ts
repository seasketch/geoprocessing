import {
  ValidationError,
  PreprocessingHandler,
  VectorDataSource,
  isPolygonFeature,
  Feature,
  Polygon,
  MultiPolygon,
  clip,
} from "@seasketch/geoprocessing";
import area from "@turf/area";
import bbox from "@turf/bbox";
import { featureCollection as fc } from "@turf/helpers";
import flatten from "@turf/flatten";
import kinks from "@turf/kinks";
import { clipMultiMerge } from "@seasketch/geoprocessing";

const MAX_SIZE = 500000 * 1000 ** 2;

type OsmLandFeature = Feature<Polygon, { gid: number }>;
type EezLandUnion = Feature<Polygon, { gid: number; UNION: string }>;

// Defined at module level for potential caching/reuse by serverless process
const SubdividedOsmLandSource = new VectorDataSource<OsmLandFeature>(
  "https://d3p1dsef9f0gjr.cloudfront.net/"
);
const SubdividedEezLandUnionSource = new VectorDataSource<EezLandUnion>(
  "https://d3muy0hbwp5qkl.cloudfront.net"
);

export async function clipLand(feature: Feature<Polygon | MultiPolygon>) {
  const landFeatures = await SubdividedOsmLandSource.fetchUnion(
    bbox(feature),
    "gid"
  );
  if (landFeatures.features.length === 0) return feature;
  return clip(fc([feature, ...landFeatures.features]), "difference");
}

export async function clipOutsideEez(
  feature: Feature<Polygon | MultiPolygon>,
  eezFilterByNames: string[] = []
) {
  let eezFeatures = await SubdividedEezLandUnionSource.fetch(bbox(feature));
  if (eezFeatures.length === 0) return feature;
  // Optionally filter down to a single country/union EEZ boundary
  if (eezFilterByNames.length > 0) {
    eezFeatures = eezFeatures.filter((e) =>
      eezFilterByNames.includes(e.properties.UNION)
    );
  }
  return clipMultiMerge(feature, fc(eezFeatures), "intersection");
}

/**
 * Takes a Polygon feature and returns the portion that is in the ocean and within an EEZ boundary
 * If results in multiple polygons then returns the largest
 */
export async function clipToOceanEez(
  feature: Feature,
  eezFilterByNames?: string[]
): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  if (area(feature) > MAX_SIZE) {
    throw new ValidationError(
      "Please limit sketches to under 500,000 square km"
    );
  }

  const kinkPoints = kinks(feature);
  if (kinkPoints.features.length > 0) {
    throw new ValidationError("Your sketch polygon crosses itself.");
  }

  let clipped = await clipLand(feature);
  if (clipped) clipped = await clipOutsideEez(clipped, eezFilterByNames);

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Sketch is outside of project boundaries");
  } else {
    if (clipped.geometry.type === "MultiPolygon") {
      const flattened = flatten(clipped);
      let biggest = [0, 0];
      for (var i = 0; i < flattened.features.length; i++) {
        const a = area(flattened.features[i]);
        if (a > biggest[0]) {
          biggest = [a, i];
        }
      }
      return flattened.features[biggest[1]] as Feature<Polygon>;
    } else {
      return clipped;
    }
  }
}

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description:
    "Erases portion of sketch overlapping with land or extending into ocean outsize EEZ boundary",
  timeout: 40,
  requiresProperties: [],
});

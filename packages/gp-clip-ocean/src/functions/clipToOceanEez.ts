import {
  ValidationError,
  PreprocessingHandler,
  VectorDataSource,
  intersect,
  difference,
  isPolygon,
} from "@seasketch/geoprocessing";
import area from "@turf/area";
import { Feature, Polygon, MultiPolygon, FeatureCollection } from "geojson";
import bbox from "@turf/bbox";
import { featureCollection as fc } from "@turf/helpers";
import combine from "@turf/combine";
import flatten from "@turf/flatten";

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
  const combined = combine(landFeatures).features[0] as Feature<MultiPolygon>;
  return difference(feature, combined);
}

export async function clipOutsideEez(
  feature: Feature<Polygon | MultiPolygon>,
  eezFilterByNames: string[] = []
) {
  let eezFeatures = await SubdividedEezLandUnionSource.fetch(bbox(feature));
  // Optionally filter down to a single country/union EEZ boundary
  if (eezFilterByNames.length > 0) {
    eezFeatures = eezFeatures.filter((e) =>
      eezFilterByNames.includes(e.properties.UNION)
    );
  }
  const combined = combine(fc(eezFeatures))
    .features[0] as Feature<MultiPolygon>;
  return intersect(feature, combined);
}

/**
 * Takes a Polygon feature and returns the portion that is in the ocean and within an EEZ boundary
 * If results in multiple polygons then returns the largest
 */
async function clipToOceanEez(
  feature: Feature,
  eezFilterByNames?: string[]
): Promise<Feature> {
  if (!isPolygon(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  if (area(feature) > MAX_SIZE) {
    throw new ValidationError(
      "Please limit sketches to under 500,000 square km"
    );
  }

  let clipped = await clipLand(feature);
  clipped = await clipOutsideEez(clipped, eezFilterByNames);

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

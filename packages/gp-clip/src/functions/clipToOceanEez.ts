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
import { union } from "union-subdivided-polygons";
import bbox from "@turf/bbox";
import { featureCollection as fc } from "@turf/helpers";
import combine from "@turf/combine";
import flatten from "@turf/flatten";

type OsmLandFeature = Feature<Polygon, { gid: number }>;
type EezLandUnion = Feature<Polygon, { gid: number }>;

const SubdividedOsmLandSource = new VectorDataSource<OsmLandFeature>(
  "https://d3dkn3cj5tf08d.cloudfront.net/"
);
const SubdividedEezLandUnionSource = new VectorDataSource<EezLandUnion>(
  "https://d3muy0hbwp5qkl.cloudfront.net"
);

/**
 * Takes a feature and returns the portion that is in the ocean and within an EEZ boundary
 * If results in multiple polygons then returns the largest
 */
async function clipToOceanEez(feature: Feature): Promise<Feature> {
  if (!isPolygon(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  if (area(feature) > 500000 * 1000 ** 2) {
    throw new ValidationError(
      "Please limit sketches to under 500,000 square km"
    );
  }

  // Subtract land from feature, giving water portion (may be single or multi polygon)
  const clippedToOcean = await (async () => {
    const subdividedLand = await SubdividedOsmLandSource.fetch(bbox(feature));
    if (subdividedLand.length === 0) {
      return feature;
    } else {
      // Combine subdivided land into a single MultiPolygon for ease of calculation
      const unioned = union(
        fc(subdividedLand),
        "gid"
      ) as FeatureCollection<Polygon>;
      const combined = combine(unioned).features[0] as Feature<MultiPolygon>;
      return difference(feature, combined);
    }
  })();

  // Intersect remainder with eez_union_land, leaving portion within EEZ boundary
  const clippedToOceanEez = await (async () => {
    const subdividedEez = await SubdividedEezLandUnionSource.fetch(
      bbox(feature)
    );
    if (subdividedEez.length === 0) {
      return feature;
    } else {
      // Combine subdivided land into a single MultiPolygon for ease of calculation
      const unioned = union(
        fc(subdividedEez),
        "gid"
      ) as FeatureCollection<Polygon>;
      const combined = combine(unioned).features[0] as Feature<MultiPolygon>;
      return intersect(clippedToOcean, combined);
    }
  })();

  if (!clippedToOceanEez || area(clippedToOceanEez) === 0) {
    throw new ValidationError("Sketch is outside of project boundaries");
  } else {
    if (clippedToOceanEez.geometry.type === "MultiPolygon") {
      const flattened = flatten(clippedToOceanEez);
      let biggest = [0, 0];
      for (var i = 0; i < flattened.features.length; i++) {
        const a = area(flattened.features[i]);
        if (a > biggest[0]) {
          biggest = [a, i];
        }
      }
      return flattened.features[biggest[1]] as Feature<Polygon>;
    } else {
      return clippedToOceanEez;
    }
  }
}

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description:
    "Removes land and ocean outsize EEZ boundary from a sketch using OpenStreetMap land polygons and MarineRegions EEZ boundaries",
  timeout: 40,
  requiresProperties: [],
});

import {
  ValidationError,
  PreprocessingHandler,
  VectorDataSource,
  intersect,
} from "@seasketch/geoprocessing";
import area from "@turf/area";
import { Feature, BBox, Polygon, MultiPolygon } from "geojson";
import { union } from "union-subdivided-polygons";
import bbox from "@turf/bbox";
import { featureCollection as fc } from "@turf/helpers";
import * as martinez from "martinez-polygon-clipping";
import combine from "@turf/combine";
import flatten from "@turf/flatten";
import { getGeom } from "@turf/invariant";
import { feature, multiPolygon, polygon } from "@turf/helpers";
import eez from "../../data/eez-clipping-mask-landward-extension.json";

type LandFeature = Feature<
  Polygon | MultiPolygon,
  {
    id: number;
    _oid: number;
  }
>;

const OSMLand = new VectorDataSource<LandFeature>(
  "https://d3dkn3cj5tf08d.cloudfront.net/"
);

async function clipToEez(feature: Feature): Promise<Feature> {
  if (!isPolygon(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  const box2d = bbox(feature);

  let land = await OSMLand.fetch(box2d);
  if (area(feature) > 500000 * 1000 ** 2) {
    throw new ValidationError(
      "Please limit sketches to under 500,000 square km"
    );
  }
  let clipped: Feature<Polygon | MultiPolygon> | null = feature;
  if (land.length !== 0) {
    land = land.filter((feature) => {
      const a = box2d;
      const b = feature.bbox || bbox(feature);
      // overlap test since bundles sometimes aren't entirely well packed
      if (a[2] >= b[0] && b[2] >= a[0] && a[3] >= b[1] && b[3] >= a[1]) {
        return true;
      }
      return false;
    });
    const unioned = union(fc(land), "_oid");
    // @ts-ignore
    const combined = combine(unioned).features[0];
    clipped = difference(feature, combined);
  }
  // @ts-ignore
  clipped = intersect(
    clipped as Feature<Polygon | MultiPolygon>,
    eez.features[0] as Feature<Polygon>
  );

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

export default new PreprocessingHandler(clipToEez, {
  title: "eraseLand",
  description:
    "Removes land from a sketch using osm land polygons and clips to Guyana EEZ",
  timeout: 40,
  memory: 1024,
  requiresProperties: [],
});

function isPolygon(feature: Feature): feature is Feature<Polygon> {
  return feature.geometry.type === "Polygon";
}

function difference(
  polygon1: Feature<Polygon | MultiPolygon>,
  polygon2: Feature<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null {
  var geom1 = getGeom(polygon1);
  var geom2 = getGeom(polygon2);
  var properties = polygon1.properties || {};

  if (!geom1) return null;
  if (!geom2) return feature(geom1, properties);

  var differenced = martinez.diff(geom1.coordinates, geom2.coordinates);
  if (differenced.length === 0) return null;
  // @ts-ignore
  if (differenced.length === 1) return polygon(differenced[0], properties);
  // @ts-ignore
  return multiPolygon(differenced, properties);
}

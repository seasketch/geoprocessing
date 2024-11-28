import polygonClipping from "polygon-clipping";
import {
  multiPolygon,
  polygon,
  geomEach,
  getGeom,
  featureCollection,
  area,
} from "@turf/turf";
import {
  Feature,
  MultiPolygon,
  Polygon,
  FeatureCollection,
  Position,
  GeoJsonProperties,
} from "../types/geojson.js";
import { ValidationError } from "../types/index.js";
import { chunk } from "../helpers/chunk.js";

/**
 * Performs one of 4 different clip operations on features
 * @param features - FeatureCollection of Polygons or MultiPolygons.  First feature is the subject, the rest are the clippers
 * @param operation - one of "union", "intersection", "xor", "difference"
 * @param options - optional properties to set on the resulting feature
 * @returns clipped Feature of Polygon or MultiPolygon
 */
export function clip<
  P extends GeoJsonProperties | undefined = GeoJsonProperties,
>(
  features: FeatureCollection<Polygon | MultiPolygon>,
  operation: "union" | "intersection" | "xor" | "difference",
  options: {
    properties?: P;
  } = {},
): Feature<Polygon | MultiPolygon> | null {
  if (!features || !features.features || features.features.length === 0)
    throw new ValidationError("Missing or empty features for clip");
  const coords: (Position[][] | Position[][][])[] = [];
  geomEach(features, (geom) => {
    coords.push(geom.coordinates);
  });
  //@ts-expect-error type mismatch
  const clipped = polygonClipping[operation](coords[0], ...coords.slice(1));

  if (clipped.length === 0) return null;
  if (clipped.length === 1)
    return polygon(clipped[0], options.properties) as Feature<
      Polygon | MultiPolygon
    >;
  return multiPolygon(clipped, options.properties) as Feature<
    Polygon | MultiPolygon
  >;
}

/**
 * Performs clip after first merging features2 coords into a single multipolygon.
 * Avoids errors in underlying clipping library when too many features in features2
 * @param feature1 polygon or multipolygon to clip
 * @param features2 collection of polygons or multipolygons to clip feature1 against
 * @param operation one of "union", "intersection", "xor", "difference"
 * @param options.properties properties to set on the resulting feature
 * @returns polygon or multipolygon feature result from clip operation, if no overlap then returns null
 */
export function clipMultiMerge<
  P extends GeoJsonProperties | undefined = GeoJsonProperties,
>(
  feature1: Feature<Polygon | MultiPolygon>,
  features2: FeatureCollection<Polygon | MultiPolygon>,
  operation: "union" | "intersection" | "xor" | "difference",
  options: {
    properties?: P;
  } = {},
): Feature<Polygon | MultiPolygon> | null {
  if (
    !feature1 ||
    !features2 ||
    !features2.features ||
    features2.features.length === 0
  )
    throw new ValidationError("Missing or empty features for clip");

  const geom1 = getGeom(feature1);

  // Combine features2 into one multipoly coordinate array so that it is operated on in one go
  const coords2 = (() => {
    return features2.features.reduce<MultiPolygon["coordinates"]>(
      (acc, poly) => {
        if (poly.geometry.type === "Polygon") {
          return [...acc, poly.geometry.coordinates];
        } else {
          return [...acc, ...poly.geometry.coordinates];
        }
      },
      [],
    );
  })();
  const result = polygonClipping[operation](
    geom1.coordinates as any,
    coords2 as any,
  );
  if (result.length === 0) return null;
  if (result.length === 1)
    return polygon(result[0], options.properties) as Feature<
      Polygon | MultiPolygon
    >;
  return multiPolygon(result, options.properties) as Feature<
    Polygon | MultiPolygon
  >;
}

/**
 * Calculates area overlap between a feature A and a feature array B.
 * Intersection is done in chunks on featuresB to avoid errors due to too many features
 * @param featureA single feature to intersect with featuresB
 * @param featuresB array of features
 * @param chunkSize Size of array to split featuresB into, avoids intersect failure due to large array)
 * @returns intersection of featureA with featuresB
 */
export const intersectInChunks = (
  featureA: Feature<Polygon | MultiPolygon>,
  featuresB: Feature<Polygon | MultiPolygon>[],
  chunkSize: number,
) => {
  // chunk to avoid blowing up intersect
  const chunks = chunk(featuresB, chunkSize || 5000);
  // intersect chunks and flatten into single result
  return chunks.flatMap((curChunk) => {
    // MultiMerge will merge curChunk FC into a single multipolygon before intersection
    const rem = clipMultiMerge(
      featureA,
      featureCollection(curChunk),
      "intersection",
    );
    return rem || [];
  });
};

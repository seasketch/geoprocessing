import { featureCollection, polygon, bbox } from "@turf/turf";
import {
  Geometry,
  Polygon,
  MultiPolygon,
  Feature,
  FeatureCollection,
  SketchGeometryTypes,
} from "../types/index.js";
import { isFeature } from "./geo.js";
import { v4 as uuid } from "uuid";

/** Helper to convert a Feature or a FeatureCollection to a Feature array */
export function toFeatureArray(input: Feature | FeatureCollection) {
  if (isFeature(input)) {
    return [input];
  } else {
    return input.features;
  }
}

export function toFeaturePolygonArray(
  input:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>
) {
  if (isFeature(input)) {
    return [input];
  } else {
    return input.features;
  }
}

/**
 * Returns a Feature with given features geometry and properties. Reasonable defaults are given for properties not provided
 * Default geometry is a square from 0,0 to 1,1
 */
export const genFeature = <G extends Geometry = SketchGeometryTypes>(
  options: {
    feature?: Feature<G>;
    name?: string;
    id?: string;
  } = {}
): Feature<G> => {
  const {
    feature = polygon([
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
    ]) as unknown as Feature<G>,
    name = `feature-${uuid()}`,
    id = uuid(),
  } = options;
  return {
    ...feature,
    id,
    properties: {
      id,
      name,
    },
    bbox: feature.bbox
      ? feature.bbox
      : feature.geometry
        ? bbox(feature.geometry)
        : undefined,
  };
};

/**
 * Given array of features, return a feature collection with given properties.
 * Generates reasonable default values for any properties not passed in
 * The geometry type of the returned collection will match the one passed in
 * Properties of features are retained
 */
export const genFeatureCollection = <G extends Geometry = SketchGeometryTypes>(
  features: Feature<G>[],
  options: {
    name?: string;
    id?: string;
  } = {}
): FeatureCollection<G> => {
  const fcId = options.id || uuid();
  const { id = fcId, name = `featureCollection-${fcId}` } = options;

  return {
    type: "FeatureCollection",
    features: features.map((feat, index) => {
      const fId = uuid();
      return {
        ...feat,
        id: fId,
        properties: {
          ...feat.properties,
          id: fId,
          name: feat.properties?.name || `${name}-${index}`,
        },
      };
    }),
    bbox: bbox(featureCollection(features)),
  };
};

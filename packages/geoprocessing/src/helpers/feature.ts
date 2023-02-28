import { featureCollection, polygon } from "@turf/helpers";
import {
  Feature,
  FeatureCollection,
  Polygon,
  SketchGeometryTypes,
} from "../types";
import { isFeature } from "./geo";
import { v4 as uuid } from "uuid";
import bbox from "@turf/bbox";

/** Helper to convert a Feature or a FeatureCollection to a Feature array */
export function toFeatureArray(input: Feature | FeatureCollection) {
  if (isFeature(input)) {
    return [input];
  } else {
    return input.features;
  }
}

export function toFeaturePolygonArray(
  input: Feature<Polygon> | FeatureCollection<Polygon>
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
export const genFeature = <G = SketchGeometryTypes>(
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
    bbox: feature.bbox || bbox(feature.geometry),
  };
};

/**
 * Given array of features, return a feature collection with given properties.
 * Generates reasonable default values for any properties not passed in
 * The geometry type of the returned collection will match the one passed in
 * Properties of features are retained
 */
export const genFeatureCollection = <G = SketchGeometryTypes>(
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

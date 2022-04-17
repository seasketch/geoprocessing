import {
  Geometry,
  Feature,
  Polygon,
  LineString,
  Point,
  FeatureCollection,
} from "../types/geojson";

/**
 * Check if object is a Feature.  Any code inside a block guarded by a conditional call to this function will have type narrowed to Feature
 */
export function isGeometry(geometry: any): geometry is Geometry {
  return (
    geometry.hasOwnProperty("geometry") &&
    geometry.hasOwnProperty("properties") &&
    geometry.hasOwnProperty("type") &&
    geometry.type !== "Feature"
  );
}

/**
 * Check if object is a Feature.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isFeature(feature: any): feature is Feature {
  return (
    feature.hasOwnProperty("properties") &&
    feature.hasOwnProperty("type") &&
    feature.type === "Feature"
  );
}

/**
 * Check if object is a Polygon.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isPolygonFeature(feature: any): feature is Feature<Polygon> {
  return isFeature(feature) && feature.geometry.type === "Polygon";
}

/**
 * Check if object is a Linestring.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isLineStringFeature(
  feature: any
): feature is Feature<LineString> {
  return isFeature(feature) && feature.geometry.type === "LineString";
}

/**
 * Check if object is a Point.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isPointFeature(feature: any): feature is Feature<Point> {
  return isFeature(feature) && feature.geometry.type === "Point";
}

/**
 * Check if object is a Feature Collection.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isFeatureCollection(
  feature: any
): feature is FeatureCollection {
  return (
    feature.hasOwnProperty("type") &&
    feature.hasOwnProperty("features") &&
    feature.type === "FeatureCollection"
  );
}

// Verifies that features in collection are all of the specified type
export const collectionHasGeometry = (
  collection: FeatureCollection,
  g: string
) => {
  return collection.features.reduce<boolean>(
    (acc, f) => acc && f.geometry.type === "Polygon",
    true
  );
};

import {
  Geometry,
  Feature,
  Polygon,
  MultiPolygon,
  LineString,
  Point,
  FeatureCollection,
} from "../types/geojson.js";

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
 * Check if object is a Polygon feature.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isPolygonFeature(feature: any): feature is Feature<Polygon> {
  return isFeature(feature) && feature.geometry.type === "Polygon";
}

/**
 * Check if object is an array of Polygon features.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isPolygonFeatureArray(
  featureArray: any
): featureArray is Feature<Polygon>[] {
  return (
    Array.isArray(featureArray) &&
    featureArray.reduce<boolean>((last, feat) => {
      return last && isFeature(feat);
    }, true)
  );
}

/**
 * Check if object is a MultiPolygon.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isMultiPolygonFeature(
  feature: any
): feature is Feature<MultiPolygon> {
  return isFeature(feature) && feature.geometry.type === "MultiPolygon";
}

/**
 * Check if object is a Polygon or MultiPolygon.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isPolygonAnyFeature(
  feature: any
): feature is Feature<MultiPolygon> {
  return (
    isFeature(feature) &&
    (isPolygonFeature(feature) || isMultiPolygonFeature(feature))
  );
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
  /** one or more geometry types */
  g: string | string[]
) => {
  const gTypes = Array.isArray(g) ? g : [g];
  return collection.features.reduce<boolean>(
    (acc, f) =>
      acc &&
      !!f.geometry &&
      !!f.geometry.type &&
      gTypes.includes(f.geometry.type),
    true
  );
};

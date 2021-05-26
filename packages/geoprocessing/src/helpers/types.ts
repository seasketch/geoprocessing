import {
  Sketch,
  SketchCollection,
  Geometry,
  Feature,
  FeatureCollection,
} from "../types";

/**
 * Type narrowing to allow property checking when object can be multiple types
 * https://fettblog.eu/typescript-hasownproperty/
 * Any code inside a block guarded by a conditional call to this function will have type narrowed to X
 */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

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
 * Check if object is a Feature.  Any code inside a block guarded by a conditional call to this function will have type narrowed to Feature
 */
export function isFeature(feature: any): feature is Feature {
  return (
    feature.hasOwnProperty("geometry") &&
    feature.hasOwnProperty("properties") &&
    feature.hasOwnProperty("type") &&
    feature.type === "Feature"
  );
}

/**
 * Check if object is a Feature Collection.  Any code inside a block guarded by a conditional call to this function will have type narrowed to FeatureCollection
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

/**
 * Checks if object is a Sketch.  Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch
 */
export const isSketch = (feature: any): feature is Sketch => {
  return isFeature(feature) && feature.hasOwnProperty("type");
};

/**
 * Check if object is a SketchCollection.  Any code inside a block guarded by a conditional call to this function will have type narrowed to SketchCollection
 */
export const isSketchCollection = (
  collection: any
): collection is SketchCollection => {
  return (
    isFeatureCollection(collection) &&
    collection.features.map(isSketch).reduce((acc, cur) => acc && cur, true)
  );
};

import { Sketch, SketchCollection, Feature, FeatureCollection } from "../types";

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
export function isFeature(
  feature: Sketch | SketchCollection | Feature | FeatureCollection
): feature is Feature {
  return feature.type === "Feature";
}

/**
 * Check if object is a Feature Collection.  Any code inside a block guarded by a conditional call to this function will have type narrowed to FeatureCollection
 */
export function isFeatureCollection(
  feature: Sketch | SketchCollection | Feature | FeatureCollection
): feature is FeatureCollection {
  return feature.type === "FeatureCollection";
}

/**
 * Checks if object is a Sketch.  Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch
 */
export const isSketch = (
  feature: Sketch | SketchCollection | Feature | FeatureCollection
): feature is Sketch => {
  return feature.hasOwnProperty("bbox") && feature.type !== "FeatureCollection";
};

/**
 * Check if object is a SketchCollection.  Any code inside a block guarded by a conditional call to this function will have type narrowed to SketchCollection
 */
export const isSketchCollection = (
  collection: Sketch | SketchCollection | Feature | FeatureCollection
): collection is SketchCollection => {
  const hasAllSketches =
    hasOwnProperty(collection, "features") &&
    collection.features.map(isSketch).reduce((acc, cur) => acc && cur, true);
  return collection.type === "FeatureCollection" && hasAllSketches;
};

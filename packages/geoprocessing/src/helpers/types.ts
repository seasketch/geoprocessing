import {
  Sketch,
  SketchCollection,
  Geometry,
  Feature,
  Polygon,
  LineString,
  Point,
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

function isObject(val: unknown) {
  return val ? typeof val === "object" : false;
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
 * Check if object is a Feature.  Any code inside a block guarded by a conditional call to this function will have type narrowed
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
 * Check if object is a Polygon.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isPolygon(feature: Feature): feature is Feature<Polygon> {
  return feature.geometry.type === "Polygon";
}

/**
 * Check if object is a Linestring.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isLineString(feature: Feature): feature is Feature<LineString> {
  return feature.geometry.type === "LineString";
}

/**
 * Check if object is a Point.  Any code inside a block guarded by a conditional call to this function will have type narrowed
 */
export function isPoint(feature: Feature): feature is Feature<Point> {
  return feature.geometry.type === "Point";
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

/**
 * Checks if object is a Sketch.  Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch
 */
export const isSketch = (feature: any): feature is Sketch => {
  return (
    isFeature(feature) &&
    hasOwnProperty(feature, "type") &&
    hasOwnProperty(feature, "properties") &&
    feature.properties &&
    feature.properties.name
  );
};

/**
 * Check if object is a SketchCollection.  Any code inside a block guarded by a conditional call to this function will have type narrowed to SketchCollection
 */
export const isSketchCollection = (
  collection: any
): collection is SketchCollection => {
  return (
    isFeatureCollection(collection) &&
    hasOwnProperty(collection, "properties") &&
    isObject(collection.properties) &&
    hasOwnProperty(collection.properties as Record<string, any>, "name") &&
    collection.features.map(isSketch).reduce((acc, cur) => acc && cur, true)
  );
};

// Verifies that features in collection are all of the specified type
const collectionHasGeometry = (collection: FeatureCollection, g: string) => {
  return collection.features.reduce<boolean>(
    (acc, f) => acc && f.geometry.type === "Polygon",
    true
  );
};

export const isSketchCollectionPolygon = (
  collection: any
): collection is SketchCollection<Polygon> => {
  return (
    isSketchCollection(collection) &&
    collectionHasGeometry(collection, "Polygon")
  );
};

export const isSketchCollectionLineString = (
  collection: any
): collection is SketchCollection<LineString> => {
  return (
    isSketchCollection(collection) &&
    collectionHasGeometry(collection, "LineString")
  );
};

export const isSketchCollectionPoint = (
  collection: any
): collection is SketchCollection<Point> => {
  return (
    isSketchCollection(collection) && collectionHasGeometry(collection, "Point")
  );
};

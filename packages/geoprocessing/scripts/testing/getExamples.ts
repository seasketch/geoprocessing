import fs from "fs-extra";
import {
  Sketch,
  SketchCollection,
  Feature,
  Polygon,
  MultiPolygon,
  LineString,
  Point,
  SketchMap,
  FeatureMap,
  SketchGeometryTypes,
} from "../../src/types/index.js";
import path from "path";
import {
  isSketch,
  isSketchCollection,
  isPolygonFeature,
  isMultiPolygonFeature,
  isPolygonAnyFeature,
  isLineStringFeature,
  isPointFeature,
  isPolygonSketchCollection,
  isMultiPolygonSketchCollection,
  isPolygonAllSketchCollection,
  isLineStringSketchCollection,
  isPointSketchCollection,
  isFeature,
} from "../../src/helpers/index.js";

/**
 * Reads all files from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 */
export async function getExampleSketchAll(
  partialName?: string,
): Promise<Array<Sketch | SketchCollection>> {
  const sketches: Array<Sketch | SketchCollection> = [];
  if (fs.existsSync("examples/sketches")) {
    const filenames = await fs.readdir("examples/sketches");
    await Promise.all(
      filenames
        .filter((fname) => /\.json/.test(fname))
        .map(async (f) => {
          const sketch = await fs.readJSON(`examples/sketches/${f}`);
          sketches.push(sketch);
        }),
    );
  }
  const filtered = sketches.filter((f) =>
    partialName ? f.properties?.name.includes(partialName) : f,
  );
  return filtered;
}

/**
 * Reads all Polygon sketch and sketch collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePolygonSketchAll(
  partialName?: string,
): Promise<Array<Sketch<Polygon> | SketchCollection<Polygon>>> {
  return (await getExampleSketchAll(partialName)).filter(
    (s) => isPolygonFeature(s) || isPolygonSketchCollection(s),
  ) as Sketch<Polygon>[];
}

/**
 * Reads all MultiPolygon sketch and sketch collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExampleMultiPolygonSketchAll(
  partialName?: string,
): Promise<Array<Sketch<MultiPolygon> | SketchCollection<MultiPolygon>>> {
  return (await getExampleSketchAll(partialName)).filter(
    (s) => isMultiPolygonFeature(s) || isMultiPolygonSketchCollection(s),
  ) as Sketch<MultiPolygon>[];
}

/**
 * Reads all polygon type (Polygon or MultiPolygon) sketch and sketch
 * collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePolygonAllSketchAll(
  partialName?: string,
): Promise<
  Array<
    Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>
  >
> {
  return (await getExampleSketchAll(partialName)).filter(
    (s) => isPolygonAnyFeature(s) || isPolygonAllSketchCollection(s),
  ) as Sketch<Polygon | MultiPolygon>[];
}

/**
 * Reads all LineString sketch and sketch collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExampleLineStringSketchAll(
  partialName?: string,
): Promise<Array<Sketch<LineString> | SketchCollection<LineString>>> {
  return (await getExampleSketchAll(partialName)).filter(
    (s) => isLineStringFeature(s) || isLineStringSketchCollection(s),
  ) as Sketch<LineString>[];
}

/**
 * Reads all Point sketch and sketch collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePointSketchAll(
  partialName?: string,
): Promise<Array<Sketch<Point> | SketchCollection<Point>>> {
  return (await getExampleSketchAll(partialName)).filter(
    (s) => isPointFeature(s) || isPointSketchCollection(s),
  ) as Sketch<Point>[];
}

/**
 * Reads all sketches from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 */
export async function getExampleSketches(
  partialName?: string,
): Promise<Array<Sketch>> {
  return (await getExampleSketchAll(partialName)).filter(isSketch);
}

/**
 * Reads all Polygon sketches from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePolygonSketches(
  partialName?: string,
): Promise<Array<Sketch<Polygon>>> {
  return (await getExampleSketches(partialName)).filter(
    isPolygonFeature,
  ) as Sketch<Polygon>[];
}

/**
 * Reads all MultiPolygon sketches from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExampleMultiPolygonSketches(
  partialName?: string,
): Promise<Array<Sketch<MultiPolygon>>> {
  return (await getExampleSketches(partialName)).filter(
    isMultiPolygonFeature,
  ) as Sketch<MultiPolygon>[];
}

/**
 * Reads all Polygon or MultiPolygon sketches from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePolygonAllSketches(
  partialName?: string,
): Promise<Array<Sketch<Polygon | MultiPolygon>>> {
  return (await getExampleSketches(partialName)).filter(
    isPolygonAnyFeature,
  ) as Sketch<Polygon | MultiPolygon>[];
}

/**
 * Reads all Linestring sketches from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExampleLineStringSketches(
  partialName?: string,
): Promise<Array<Sketch<LineString>>> {
  return (await getExampleSketches(partialName)).filter(
    isLineStringFeature,
  ) as Sketch<LineString>[];
}

/**
 * Reads all Point sketches from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePointSketches(
  partialName?: string,
): Promise<Array<Sketch<Point>>> {
  return (await getExampleSketches(partialName)).filter(
    isPointFeature,
  ) as Sketch<Point>[];
}

/**
 * Reads all sketche collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 */
export async function getExampleSketchCollections(
  partialName?: string,
): Promise<Array<SketchCollection>> {
  return (await getExampleSketchAll(partialName)).filter(isSketchCollection);
}

/**
 * Reads all Polygon sketch collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePolygonSketchCollections(
  partialName?: string,
): Promise<Array<SketchCollection<Polygon>>> {
  return (await getExampleSketchCollections(partialName)).filter(
    isPolygonSketchCollection,
  ) as SketchCollection<Polygon>[];
}

/**
 * Reads all Linestring sketch collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExampleLineStringSketchCollections(
  partialName?: string,
): Promise<Array<SketchCollection<LineString>>> {
  return (await getExampleSketchCollections(partialName)).filter(
    isLineStringSketchCollection,
  ) as SketchCollection<LineString>[];
}

/**
 * Reads all Point sketch collections from examples/sketches for testing. Run from project root
 * Optionally filters out those that don't match partialName
 * TODO: remove cast if possible
 */
export async function getExamplePointSketchCollections(
  partialName?: string,
): Promise<Array<SketchCollection<Point>>> {
  return (await getExampleSketchCollections(partialName)).filter(
    isPointSketchCollection,
  ) as SketchCollection<Point>[];
}

/**
 * Convenience function returns object with sketches keyed by name
 * Optionally filters out those that don't match partialName
 * @deprecated use partialName support in getExample*Sketches(partialName) functions
 */
export async function getExampleSketchesByName(
  partialName?: string,
): Promise<SketchMap> {
  const sketches = await getExampleSketches(partialName);
  return sketches.reduce<SketchMap>((sketchObject, s) => {
    return {
      ...sketchObject,
      [s.properties.name]: s,
    };
  }, {});
}

/**
 * Reads features and featurecollections from examples/features for testing. Run from project root
 * Optionally filters out those that don't match partialName
 */
export async function getExampleFeaturesAll(partialName?: string) {
  const features: Feature<SketchGeometryTypes>[] = [];
  if (fs.existsSync("examples/features")) {
    const filenames = await fs.readdir("examples/features");
    await Promise.all(
      filenames
        .filter((fname) => /\.json/.test(fname))
        .map(async (f) => {
          const feature = await fs.readJSON(`examples/features/${f}`);
          feature.properties = feature.properties || {};
          feature.properties.name = feature.properties.name || path.basename(f);
          features.push(feature);
        }),
    );
  }
  const filtered = features.filter((f) =>
    partialName ? f.properties?.name.includes(partialName) : f,
  );
  return filtered;
}

/**
 * Reads features of all types from examples/features for testing. Run from project root
 * Optionally filters out those that don't match partialName
 */
export async function getExampleFeatures(partialName?: string) {
  return (await getExampleFeaturesAll(partialName)).filter(
    isFeature,
  ) as Feature[];
}

/**
 * Reads features of all types from examples/features for testing. Run from project root
 * Optionally filters out those that don't match partialName
 */
export async function getExamplePolygonFeatures(partialName?: string) {
  return (await getExampleFeaturesAll(partialName)).filter(
    isPolygonFeature,
  ) as Feature<Polygon>[];
}

/**
 * Convenience function returns object with features keyed by their filename.  Features without a name will not be included
 * Optionally filters out those that don't match partialName
 */
export async function getExampleFeaturesByName(
  partialName?: string,
): Promise<FeatureMap> {
  const features = await getExampleFeatures(partialName);
  return features.reduce<FeatureMap>((featureMap, f) => {
    return f.properties?.name
      ? {
          ...featureMap,
          [f.properties.name]: f,
        }
      : featureMap;
  }, {});
}

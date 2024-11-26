import {
  Feature,
  FeatureCollection,
  Point,
  Polygon,
  MultiPolygon,
  LineString,
  Geometry,
} from "../types/geojson.js";

import {
  Sketch,
  SketchCollection,
  SketchGeometryTypes,
  NullSketch,
  NullSketchCollection,
  SketchProperties,
  UserAttribute,
} from "../types/sketch.js";

import { featureCollection, polygon, bbox } from "@turf/turf";

import { hasOwnProperty, isObject } from "./native.js";
import {
  isFeature,
  isFeatureCollection,
  collectionHasGeometry,
  isMultiPolygonFeature,
  isPolygonFeature,
} from "./geo.js";

import { v4 as uuid } from "uuid";
import { ReportContextValue } from "../context/index.js";
/**
 * UserAttributes are those filled in via the attributes form specified as
 * part of a SketchClass. This getter function is easier to use than searching
 * the Sketch.properties.userAttributes array, supports default values, and is
 * easier to use with typescript.
 */
export function getUserAttribute<T>(
  sketchOrProps: Sketch | SketchCollection | SketchProperties,
  exportid: string,
): T | undefined;
export function getUserAttribute<T>(
  sketchOrProps: Sketch | SketchCollection | SketchProperties,
  exportid: string,
  defaultValue: T,
): T;
export function getUserAttribute<T>(
  sketchOrProps: Sketch | SketchCollection | SketchProperties,
  exportid: string,
  defaultValue?: T,
) {
  const props = (() => {
    if (isSketch(sketchOrProps)) {
      return sketchOrProps.properties;
    } else if (isSketchCollection(sketchOrProps)) {
      return sketchOrProps.properties;
    } else {
      return sketchOrProps;
    }
  })();
  const found = props.userAttributes.find((a) => a.exportId === exportid);
  return found && found.value !== undefined && found.value !== null
    ? found.value
    : defaultValue;
}

export function getJsonUserAttribute<T>(
  sketchOrProps: Sketch | SketchProperties,
  exportid: string,
  defaultValue: T,
): T {
  const value = getUserAttribute(sketchOrProps, exportid, defaultValue);
  if (typeof value === "string") {
    return JSON.parse(value);
  } else {
    return value;
  }
}

/**
 * Converts array of sketches to an array of their SketchProperties
 */
export function toSketchPropertiesArray(
  sketchArray: Sketch[] | NullSketch[],
): SketchProperties[] {
  return sketchArray.map((s) => s.properties);
}

/**
 * Returns SketchProperties for each child sketch in a SketchCollection
 */
export function toChildProperties(
  sketchCollection: SketchCollection,
): SketchProperties[] {
  return sketchCollection.features.map((sketch) => sketch.properties);
}

/**
 * Converts a Sketch or SketchCollection to a Sketch array, maintaining geometry type
 * Useful for putting in a consistent form that can be iterated over
 * @param input sketch or sketch collection
 * @returns array of sketches, if input is a sketch collection then it is the child sketches
 */
export function toSketchArray<G>(
  input: Sketch<G> | SketchCollection<G>,
): Sketch<G>[] {
  if (isSketch(input)) {
    return [input];
  } else if (isSketchCollection(input)) {
    return input.features;
  }
  throw new Error("invalid input, must be Sketch or SketchCollection");
}

/** Helper to convert a NullSketch or NullSketchCollection to a NullSketch array */
export function toNullSketchArray(
  input: NullSketch | NullSketchCollection,
): NullSketch[] {
  if (isSketch(input)) {
    return [input];
  } else if (isSketchCollection(input)) {
    return input.features;
  }
  throw new Error("invalid input, must be NullSketch or NullSketchCollection");
}

/**
 * Returns sketch or sketch collection with null geometry
 */
export function toNullSketch(
  sketch: Sketch | SketchCollection,
  useNull: boolean = false,
): NullSketch | NullSketchCollection {
  if (isSketchCollection(sketch)) {
    return {
      ...sketch,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      features: sketch.features.map(({ geometry, ...nonGeom }) => ({
        ...nonGeom,
        ...(useNull ? { geometry: null } : {}),
      })),
    };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { geometry, ...nonGeom } = sketch;
    return {
      ...nonGeom,
      ...(useNull ? { geometry: null } : {}),
    };
  }
}

/**
 * Checks if object is a Sketch.  Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch
 */
export const isSketch = (feature: any): feature is Sketch => {
  return (
    feature &&
    isFeature(feature) &&
    hasOwnProperty(feature, "type") &&
    hasOwnProperty(feature, "properties") &&
    feature.properties &&
    feature.properties.name
  );
};

/**
 * Checks if sketch is a Polygon
 */
export const isPolygonSketch = (sketch: any): sketch is Sketch<Polygon> => {
  return sketch && isSketch(sketch) && isPolygonFeature(sketch);
};

/**
 * Checks if sketch is a MultiPolygon. Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch
 */
export const isMultiPolygonSketch = (
  sketch: any,
): sketch is Sketch<MultiPolygon> => {
  return sketch && isSketch(sketch) && isMultiPolygonFeature(sketch);
};

/**
 * Check if object is a SketchCollection.  Any code inside a block guarded by a conditional call to this function will have type narrowed to SketchCollection
 */
export const isSketchCollection = (
  collection: any,
): collection is SketchCollection => {
  return (
    collection &&
    isFeatureCollection(collection) &&
    hasOwnProperty(collection, "properties") &&
    isObject(collection.properties) &&
    hasOwnProperty(collection.properties as Record<string, any>, "name") &&
    hasOwnProperty(
      collection.properties as Record<string, any>,
      "sketchClassId",
    ) &&
    collection.features.map(isSketch).reduce((acc, cur) => acc && cur, true)
  );
};

/**
 * Checks if object is a NullSketch.  Any code inside a block guarded by a conditional call to this function will have type narrowed to NullSketch
 */
export const isNullSketch = (feature: any): feature is NullSketch => {
  return (
    feature &&
    isFeature(feature) &&
    hasOwnProperty(feature, "type") &&
    hasOwnProperty(feature, "properties") &&
    feature.properties &&
    feature.properties.name &&
    !feature.geometry
  );
};

/**
 * Check if object is a NullSketchCollection.  Any code inside a block guarded by a conditional call to this function will have type narrowed to NullSketchCollection
 */
export const isNullSketchCollection = (
  collection: any,
): collection is NullSketchCollection => {
  return (
    collection &&
    isFeatureCollection(collection) &&
    hasOwnProperty(collection, "properties") &&
    isObject(collection.properties) &&
    hasOwnProperty(collection.properties as Record<string, any>, "name") &&
    collection.features.map(isNullSketch).reduce((acc, cur) => acc && cur, true)
  );
};

export const isPolygonSketchCollection = (
  collection: any,
): collection is SketchCollection<Polygon> => {
  return (
    collection &&
    isSketchCollection(collection) &&
    collectionHasGeometry(collection, "Polygon")
  );
};

export const isMultiPolygonSketchCollection = (
  collection: any,
): collection is SketchCollection<MultiPolygon> => {
  return (
    collection &&
    isSketchCollection(collection) &&
    collectionHasGeometry(collection, "MultiPolygon")
  );
};

export const isPolygonAllSketchCollection = (
  collection: any,
): collection is SketchCollection<Polygon | MultiPolygon> => {
  return (
    collection &&
    isSketchCollection(collection) &&
    collectionHasGeometry(collection, ["Polygon", "MultiPolygon"])
  );
};

export const isLineStringSketchCollection = (
  collection: any,
): collection is SketchCollection<LineString> => {
  return (
    collection &&
    isSketchCollection(collection) &&
    collectionHasGeometry(collection, "LineString")
  );
};

export const isPointSketchCollection = (
  collection: any,
): collection is SketchCollection<Point> => {
  return (
    collection &&
    isSketchCollection(collection) &&
    collectionHasGeometry(collection, "Point")
  );
};

export const genSampleUserAttributes = (): UserAttribute[] => {
  return [
    {
      label: "single",
      fieldType: "ChoiceField",
      exportId: "SINGLE",
      value: "single",
    },
    {
      label: "multi",
      fieldType: "ChoiceField",
      exportId: "MULTI",
      value: ["one", "two"],
    },
    {
      label: "multiJson",
      fieldType: "ChoiceField",
      exportId: "MULTISTRING",
      value: JSON.stringify(["one", "two"]),
    },
    {
      label: "boolean",
      value: false,
      exportId: "BOOLEAN",
      fieldType: "YesNo",
    },
  ];
};

/**
 * Returns a Sketch with given features geometry and properties. Reasonable defaults are given for properties not provided
 * Default geometry is a square from 0,0 to 1,1
 */
export const genSketch = <G extends Geometry = SketchGeometryTypes>(
  options: {
    feature?: Feature<G>;
    name?: string;
    id?: string;
    userAttributes?: UserAttribute[];
    sketchClassId?: string;
    createdAt?: string;
    updatedAt?: string;
  } = {},
): Sketch<G> => {
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
    name = `sketch-${uuid()}`,
    id = uuid(),
    userAttributes = [
      {
        label: "Type of Sketch",
        fieldType: "ChoiceField",
        exportId: "TYPE_OF_SKETCH",
        value: "sample",
      },
      {
        label: "Notes",
        fieldType: "TextArea",
        exportId: "NOTES",
        value: "This is a sample sketch",
      },
    ],
    sketchClassId = uuid(),
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = options;
  return {
    ...feature,
    id,
    properties: {
      id,
      isCollection: false,
      userAttributes,
      sketchClassId,
      createdAt,
      updatedAt,
      name,
    },
    bbox: feature.geometry ? bbox(feature.geometry) : undefined,
  };
};

/**
 * Given array of sketches, return a sketch collection with given properties.
 * Generates reasonable default values for any properties not passed in
 * The geometry type of the returned collection will match the one passed in
 * Properties of sketches are retained
 */
export const genSketchCollection = <G extends Geometry = SketchGeometryTypes>(
  sketches: Sketch<G>[],
  options: {
    name?: string;
    id?: string;
    userAttributes?: UserAttribute[];
    sketchClassId?: string;
    createdAt?: string;
    updatedAt?: string;
  } = {},
): SketchCollection<G> => {
  const collId = options.id || uuid();
  const {
    name = `sketch-${collId}`,
    id = collId,
    userAttributes = [],
    sketchClassId = uuid(),
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = options;

  return {
    type: "FeatureCollection",
    features: sketches.map((sk, index) => {
      const skId = uuid();
      return {
        ...sk,
        id: skId,
        properties: {
          ...sk.properties,
          id: skId,
          name: sk.properties.name || `${name}-${index}`,
        },
      };
    }),
    properties: {
      id,
      isCollection: true,
      userAttributes,
      sketchClassId,
      createdAt,
      updatedAt,
      name,
    },
    bbox: bbox(featureCollection(sketches)),
  };
};

/**
 * Returns a Sketch with given geometry and Geometry type, Properties are reasonable random
 */
export const genSampleSketch = <
  G extends Geometry = Polygon | MultiPolygon | LineString,
>(
  geometry: G,
  name?: string,
): Sketch<G> => ({
  type: "Feature",
  properties: {
    id: name || uuid(),
    isCollection: false,
    userAttributes: genSampleUserAttributes(),
    sketchClassId: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: name || "genSampleSketch",
  },
  geometry,
  bbox: bbox(geometry),
});

/**
 * Returns a Sketch with given geometry and Geometry type, Properties are reasonable random
 */
export const genSampleNullSketch = (name?: string): NullSketch => ({
  type: "Feature",
  properties: {
    id: name || uuid(),
    isCollection: false,
    userAttributes: genSampleUserAttributes(),
    sketchClassId: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: name || "genSampleNullSketch",
  },
});

/**
 * Given feature collection, return a sketch collection with reasonable random props.
 * The geometry type of the returned collection will match the one passed in
 * @param geometry
 */
export const genSampleSketchCollection = <G extends Geometry = Polygon>(
  fc: FeatureCollection<G>,
  name?: string,
): SketchCollection<G> => {
  // Convert features to sketches
  const sketches = fc.features.map((f) => genSampleSketch(f.geometry));
  // Rebuild into sketch collection
  return {
    ...fc,
    features: sketches,
    properties: {
      id: name || uuid(),
      isCollection: true,
      userAttributes: genSampleUserAttributes(),
      sketchClassId: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: name || `genSampleSketchCollection_${uuid()}`,
    },
    bbox: bbox(fc),
  };
};

/**
 * Given feature collection, return a sketch collection with reasonable random props.
 * The geometry type of the returned collection will match the one passed in
 * @param geometry
 */
export const genSampleSketchCollectionFromSketches = <
  G extends Geometry = Polygon | LineString,
>(
  sketches: Sketch<G>[],
  name?: string,
): SketchCollection<G> => {
  // Rebuild into sketch collection
  return {
    type: "FeatureCollection",
    features: sketches,
    properties: {
      id: name || uuid(),
      isCollection: true,
      userAttributes: genSampleUserAttributes(),
      sketchClassId: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: name || `genSampleSketchCollection_${uuid()}`,
    },
    bbox: bbox(featureCollection(sketches)),
  };
};

/**
 * Given feature collection, return a sketch collection with reasonable random props.
 * The geometry type of the returned collection will match the one passed in
 * @param geometry
 */
export const genSampleNullSketchCollection = (
  sketches: NullSketch[],
  name?: string,
): NullSketchCollection => {
  // Rebuild into sketch collection
  return {
    type: "FeatureCollection",
    features: sketches,
    properties: {
      id: name || uuid(),
      isCollection: true,
      userAttributes: genSampleUserAttributes(),
      sketchClassId: name || uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: name || `genSampleSketchCollection_${uuid()}`,
    },
  };
};

export const genSampleSketchContext = (): ReportContextValue => ({
  sketchProperties: {
    name: "My Sketch",
    id: "abc123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sketchClassId: "efg345",
    isCollection: false,
    userAttributes: [
      {
        exportId: "DESIGNATION",
        fieldType: "ChoiceField",
        label: "Designation",
        value: "Marine Reserve",
      },
      {
        exportId: "COMMENTS",
        fieldType: "TextArea",
        label: "Comments",
        value: "This is my MPA and it is going to be the greatest. Amazing.",
      },
      {
        label: "Include this?",
        value: false,
        exportId: "include_false",
        fieldType: "YesNo",
      },
    ],
  },
  geometryUri: "",
  projectUrl: "https://example.com/project",
  exampleOutputs: [
    {
      functionName: "ranked",
      sketchName: "My Sketch",
      results: {},
    },
  ],
  visibleLayers: [],
  language: "en",
});

/**
 * Given sketch or sketch collection, returns just the individual sketch features inside.
 * @param sketch
 */
export function getSketchFeatures(
  sketch: Sketch | SketchCollection | NullSketchCollection | NullSketch,
) {
  if (isSketch(sketch) || isNullSketch(sketch)) {
    return [sketch];
  } else if (isSketchCollection(sketch)) {
    return sketch.features.filter((feat) => !feat.properties.isCollection);
  } else if (isNullSketchCollection(sketch)) {
    return sketch.features.filter((feat) => !feat.properties.isCollection);
  } else {
    throw new Error("Not a valid sketch");
  }
}

/**
 * Converts Feature to Sketch with reasonable defaults given for sketch properties if not provided
 */
export const featureToSketch = <G extends SketchGeometryTypes>(
  feat: Feature<G>,
  name: string = "sketches",
  sketchProperties: Partial<SketchProperties> = {},
) => {
  const sk = genSketch({
    feature: feat,
    name,
    ...feat.properties,
    ...sketchProperties,
    id: uuid(),
  });
  sk.properties.userAttributes = [];
  return sk;
};

/**
 * Converts FeatureCollection to SketchCollection with reasonable defaults given for sketch properties if not provided
 */
export const featureToSketchCollection = <G extends SketchGeometryTypes>(
  fc: FeatureCollection<G>,
  name: string = "sketches",
  sketchProperties: Partial<SketchProperties> = {},
) => {
  const sketchFeatures = fc.features.map((feat, idx) => {
    const idValue = feat.properties?.id || idx + 1;
    const featureName = (() => {
      if (name) {
        if (feat.properties && feat.properties[name]) {
          return feat.properties[name];
        } else {
          return `${name}-${idValue}`;
        }
      } else {
        return `Area-${idValue}`;
      }
    })();

    const sk = genSketch({
      feature: feat,
      name: featureName,
      ...feat.properties,
      ...sketchProperties,
      id: `${idValue}`,
    });
    sk.properties.userAttributes = [];
    return sk;
  });

  const sc = genSketchCollection(sketchFeatures, {
    name,
  });
  sc.properties.userAttributes = [];
  return sc;
};

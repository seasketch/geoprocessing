import { ISO8601DateTime } from "./base";
import {
  Polygon,
  MultiPolygon,
  LineString,
  Point,
  Feature,
  BBox,
  FeatureCollection,
} from "./geojson";

export type SketchGeometryTypes = Polygon | MultiPolygon | LineString | Point;

/** Properties of a Sketch, defines known keys as well as unknown for extensiblity */
export type SketchProperties = Record<string, any> & {
  id: string;
  /** Name specified by the author of the sketch */
  name: string;
  updatedAt: ISO8601DateTime;
  createdAt: ISO8601DateTime;
  sketchClassId: string;
  isCollection: boolean;
  userAttributes: UserAttribute[];
};

/** User-defined attributes with values for Sketch.  Defines known keys as well as unknown for extensiblity */
export type UserAttribute = Record<string, any> & {
  exportId: string;
  /** String to display for sketch attribute name */
  label: string;
  /** String to display for sketch attribute value */
  valueLabel?: string | string[];
  /** Sketch attribute value */
  value: any;
  fieldType: string;
  /** Alternative strings to display for sketch attribute by language code */
  alternateLanguages?: Record<
    string,
    {
      label: string;
      valueLabel: any;
    }
  >;
};

// By omitting we can re-define new properties with narrower but compatible typing
export interface Sketch<G = SketchGeometryTypes>
  extends Omit<Feature, "geometry" | "properties"> {
  properties: SketchProperties;
  geometry: G;
  bbox?: BBox;
}

export interface SketchCollection<G = SketchGeometryTypes>
  extends Omit<FeatureCollection, "features"> {
  properties: SketchProperties;
  bbox: BBox;
  features: Sketch<G>[];
}

// Sketch with no geometry or null geometry, useful for lightweight exchange when geometry not needed
export interface NullSketch extends Omit<Sketch, "geometry"> {
  geometry?: null;
}

export interface NullSketchCollection
  extends Omit<SketchCollection, "features" | "bbox"> {
  bbox?: BBox;
  features: NullSketch[];
}

/**
 * A simple map of sketches and/or sketch collections keyed by their name
 */
export interface SketchMap {
  [name: string]: Sketch | SketchCollection;
}

/**
 * A simple map of features keyed by their name
 */
export interface FeatureMap {
  [name: string]: Feature;
}

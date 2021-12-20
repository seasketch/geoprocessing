import {
  Polygon,
  LineString,
  Point,
  Feature,
  BBox,
  FeatureCollection,
} from "./geojson";

export type SketchGeometryTypes = Polygon | LineString | Point;

export interface SketchProperties {
  id: string;
  /** Name specified by the author of the sketch */
  name: string;
  // ISO 8601 date/time string
  updatedAt: string;
  // ISO 8601 date/time string
  createdAt: string;
  sketchClassId: string;
  isCollection: boolean;
  userAttributes: UserAttribute[];
}

export interface UserAttribute {
  exportId: string;
  label: string;
  value: any;
  fieldType: string;
}

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

// Sketch with no geometry, useful for lightweight exchange when geometry not needed
export interface NullSketch extends Omit<Sketch, "geometry"> {
  geometry?: null;
}

export interface NullSketchCollection
  extends Omit<FeatureCollection, "features"> {
  features: NullSketch[];
}

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

export interface SketchProperties {
  id: string;
  /** Name specified by the author of the sketch */
  name: string;
  updatedAt: ISO8601DateTime;
  createdAt: ISO8601DateTime;
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

// Sketch with no geometry or null geometry, useful for lightweight exchange when geometry not needed
export interface NullSketch extends Omit<Sketch, "geometry"> {
  geometry?: null;
}

export interface NullSketchCollection
  extends Omit<SketchCollection, "features" | "bbox"> {
  bbox?: BBox;
  features: NullSketch[];
}

import {
  FeatureCollection,
  Feature,
  Geometry,
  Properties,
  BBox,
  LineString,
  Polygon,
  Point,
  GeometryTypes,
} from "@turf/helpers";

// Re-export GeoJSON type declaractions for easy import by user project
export type {
  FeatureCollection,
  Feature,
  Geometry,
  Properties,
  GeometryCollection,
  BBox,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Point,
  GeometryTypes,
} from "@turf/helpers";

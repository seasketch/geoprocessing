import { z } from "zod";
import { FeatureCollection, Polygon, MultiPolygon } from "geojson";

// Re-export GeoJSON type declaractions for easy import by user project
export type {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
  GeometryCollection,
  BBox,
  Point,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Position,
} from "geojson";

// zod schemas

export const box2dSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export const box3dSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export const bboxSchema = box2dSchema.or(box3dSchema);

export const polygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.array(z.number()))),
}) satisfies z.ZodType<Polygon>;

export const multipolygonSchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(z.array(z.number())))),
}) satisfies z.ZodType<MultiPolygon>;

/** Zod schema for Feature containing Polygon or MultiPolygon */
export const featureSchema = z.object({
  type: z.literal("Feature"),
  geometry: polygonSchema.or(multipolygonSchema),
  id: z.string().or(z.number()).optional(),
  properties: z.record(z.any()).or(z.null()).nullable(),
});

export const featuresSchema = z.array(featureSchema);

/** Zod schema for FeatureCollection containing polygons or multipolygons */
export const fcSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(featureSchema),
}) satisfies z.ZodType<FeatureCollection<Polygon | MultiPolygon>>;

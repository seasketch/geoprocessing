import { z } from 'zod'
import {
  FeatureCollection,
  Feature,
  Geometry,
  Properties,
  BBox,
  Point,
  LineString,
  Polygon,
  MultiPolygon,
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
  Point,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  GeometryTypes,
} from "@turf/helpers";

// zod schemas

export const polygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number())))
}) satisfies z.ZodType<Polygon>

export const multipolygonSchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(z.array(z.number()))))
}) satisfies z.ZodType<MultiPolygon>

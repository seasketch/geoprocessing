import { Feature, Polygon } from "geojson";

export function isPolygon(feature: Feature): feature is Feature<Polygon> {
  return feature.geometry.type === "Polygon";
}

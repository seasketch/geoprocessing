import { Feature, Polygon } from "../types";

export function isPolygon(feature: Feature): feature is Feature<Polygon> {
  return feature.geometry.type === "Polygon";
}

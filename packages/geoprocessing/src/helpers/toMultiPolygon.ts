import { multiPolygon } from "@turf/turf";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

/**
 * Converts collection of polygons or multipolygons to a single multipolygon
 * @param input array or collection of polygons or multipolygons
 * @returns multipolygon
 */
export const toMultiPolygon = (
  input:
    | FeatureCollection<Polygon | MultiPolygon>
    | Feature<Polygon | MultiPolygon>[],
): Feature<MultiPolygon> => {
  const coords = (() => {
    const features = Array.isArray(input) ? input : input.features;
    return features.reduce<MultiPolygon["coordinates"]>((acc, poly) => {
      if (poly.geometry.type === "Polygon") {
        return [...acc, poly.geometry.coordinates];
      } else {
        return [...acc, ...poly.geometry.coordinates];
      }
    }, []);
  })();

  return multiPolygon(coords);
};

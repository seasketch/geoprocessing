import { randomPolygon, featureReduce, featureCollection } from "@turf/turf";
import { Feature, BBox, Polygon } from "geojson";

/**
 * Generates random polygons within provided bounds.  numPolygons defaults to 300, max_radial_length to 0.5
 * Wrapper around @turf/random - https://turfjs.org/docs/#randomPolygon
 */
export const genRandomPolygons = (config: {
  numPolygons?: number;
  bounds: BBox;
  max_radial_length?: number;
}) => {
  const { numPolygons = 300, bounds, max_radial_length = 0.25 } = config;
  const randPolys = randomPolygon(numPolygons, {
    bbox: bounds,
    max_radial_length,
  });

  const proppedPolys = featureReduce<Feature[], Polygon, { id: number }>(
    randPolys,
    (previousValue, currentFeature, featureIndex) => {
      return previousValue.concat({
        ...currentFeature,
        id: featureIndex + 1,
        properties: {
          id: featureIndex + 1,
        },
      });
    },
    [],
  );

  const fc = featureCollection(proppedPolys);
  return fc;
};

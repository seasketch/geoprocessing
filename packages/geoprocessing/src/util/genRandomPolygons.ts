import { randomPolygon } from "@turf/random";
import { featureReduce } from "@turf/meta";
import { BBox, featureCollection, Polygon } from "@turf/helpers";

/**
 * Generates random polygons within provided bounds.  numPolygons defaults to 300, max_radial_length to 0.5
 * Wrapper around @turf/random - https://turfjs.org/docs/#randomPolygon
 */
export const genRandomPolygons = (config: {
  numPolygons?: number;
  bounds: BBox;
  max_radial_length?: number;
}) => {
  const { numPolygons = 300, bounds, max_radial_length = 0.5 } = config;
  const randPolys = randomPolygon(numPolygons, {
    bbox: bounds,
    max_radial_length,
  });

  const proppedPolys = featureReduce<any, Polygon, { id: number }>(
    randPolys,
    (previousValue, currentFeature, featureIndex) => {
      return previousValue.concat({
        ...currentFeature,
        id: featureIndex,
        properties: {
          id: featureIndex,
        },
      });
    },
    []
  );

  const fc = featureCollection(proppedPolys);
  return fc;
};

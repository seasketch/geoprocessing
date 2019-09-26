import turfArea from "@turf/area";
import {
  Sketch,
  isSeaSketchFeatureCollection
} from "@seasketch/serverless-geoprocessing";

const totalArea = (sketch: Sketch, sum = 0): number => {
  if (isSeaSketchFeatureCollection(sketch)) {
    sum += totalArea(sketch);
  } else {
    sum += turfArea(sketch);
  }
  return sum;
};

const area = (sketch: Sketch) => {
  return {
    areaKm: totalArea(sketch) / 1000
  };
};

export default area;

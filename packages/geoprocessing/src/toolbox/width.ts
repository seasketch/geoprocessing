import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import explode from "@turf/explode";
import distance from "@turf/distance";
import { AllGeoJSON } from "@turf/helpers";
import { BBox } from "../types/geojson.js";

/**
 * Returns the maximum width of the geojson or bbox
 */
export const maxWidth = (geojson: AllGeoJSON | BBox) => {
  const box = (() => {
    if (Array.isArray(geojson)) {
      return geojson as BBox;
    } else {
      return bbox(geojson);
    }
  })();

  const boxPoly = bboxPolygon(box);
  const boxPoints = explode(boxPoly);
  return Math.max(
    distance(boxPoints.features[0], boxPoints.features[1], {
      units: "degrees",
    }),
    distance(boxPoints.features[1], boxPoints.features[2], {
      units: "degrees",
    })
  );
};

/**
 * Returns the minimum width of the bounding box of given feature
 */
export const minWidth = (geojson: AllGeoJSON | BBox) => {
  const box = (() => {
    if (Array.isArray(geojson)) {
      return geojson as BBox;
    } else {
      return bbox(geojson);
    }
  })();

  const boxPoly = bboxPolygon(box);
  const boxPoints = explode(boxPoly);
  return Math.min(
    distance(boxPoints.features[0], boxPoints.features[1], {
      units: "degrees",
    }),
    distance(boxPoints.features[1], boxPoints.features[2], {
      units: "degrees",
    })
  );
};

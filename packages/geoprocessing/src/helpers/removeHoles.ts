import { Sketch, SketchCollection } from "../types";
import { MultiPolygon, Polygon } from "@turf/helpers";
import { isMultiPolygonSketch, isPolygonSketch } from "./sketch";

export function removeSketchPolygonHoles(
  sketch: Sketch<Polygon | MultiPolygon>
) {
  const newSk: Sketch<Polygon | MultiPolygon> = { ...sketch };
  if (isMultiPolygonSketch(sketch)) {
    newSk.geometry.coordinates = newSk.geometry.coordinates.map(
      (polyCoords) => {
        return [polyCoords[0]];
      }
    );
  } else if (isPolygonSketch(sketch)) {
    newSk.geometry.coordinates = [sketch.geometry.coordinates[0]];
  }
  return newSk;
}

export function removeSketchCollPolygonHoles(
  sketchColl: SketchCollection<Polygon | MultiPolygon>
) {
  return sketchColl.features.map((sk) => removeSketchPolygonHoles(sk));
}

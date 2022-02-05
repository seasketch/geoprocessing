import { Sketch, SketchCollection } from "../types";
import { Polygon } from "@turf/helpers";

export function removeSketchPolygonHoles(sketch: Sketch<Polygon>) {
  const newSk: Sketch<Polygon> = { ...sketch };
  newSk.geometry.coordinates = [sketch.geometry.coordinates[0]];
  return newSk;
}

export function removeSketchCollPolygonHoles(
  sketchColl: SketchCollection<Polygon>
) {
  return sketchColl.features.map((sk) => removeSketchPolygonHoles(sk));
}

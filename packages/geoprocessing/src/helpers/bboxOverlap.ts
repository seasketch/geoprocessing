import { BBox } from "../types/index.js";

/** Returns whether bounding box A overlaps with or touches bounding box B */
export function bboxOverlap(a: BBox, b: BBox) {
  return a[2] >= b[0] && b[2] >= a[0] && a[3] >= b[1] && b[3] >= a[1];
}

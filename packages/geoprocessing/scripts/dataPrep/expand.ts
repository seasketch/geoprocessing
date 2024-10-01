import { BBox } from "../../src/types/index.js";

/**
 * Expands bboxA to incorporate bboxB
 * @param bboxA
 * @param bboxB
 */
export default function expand(bboxA: BBox | null, bboxB: BBox): BBox {
  if (bboxA) {
    const returnVal = [...bboxA] as BBox;
    if (bboxB[0] < bboxA[0]) {
      returnVal[0] = bboxB[0];
    }
    if (bboxB[1] < bboxA[1]) {
      returnVal[1] = bboxB[1];
    }
    if (bboxB[2] > bboxA[2]) {
      returnVal[2] = bboxB[2];
    }
    if (bboxB[3] > bboxA[3]) {
      returnVal[3] = bboxB[3];
    }
    return returnVal;
  } else {
    return bboxB;
  }
}

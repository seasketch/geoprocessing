import { isSketchCollection } from "./sketch";
import { SketchGeometryTypes, SketchCollection } from "../types";

import bbox from "@turf/bbox";

//// Helper methods ////

/**
 * If sketch collection passes sketchTest, then returns new collection
 * with mergeSketchColl sketches appended and updated bbox
 */
export function includeVirtualSketch<G extends SketchGeometryTypes>(
  sketchColl: SketchCollection<G>,
  mergeSketchColl: SketchCollection<G>,
  sketchTest: (collection: SketchCollection) => boolean
) {
  if (!isSketchCollection(sketchColl) || !isSketchCollection(mergeSketchColl)) {
    throw new Error(`Expected sketch collection for includeVirtualSketch`);
  }
  if (sketchTest(sketchColl)) {
    let finalSketch = sketchColl;
    finalSketch = {
      ...sketchColl,
      features: [...sketchColl.features, ...mergeSketchColl.features],
    };
    finalSketch.bbox = bbox(finalSketch);
    return finalSketch;
  } else {
    return sketchColl;
  }
}

export const isTruthyAttributeValue = (value: unknown) => {
  return value === "Yes" || value === "yes" || value === true ? true : false;
};

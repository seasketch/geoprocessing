import { Feature, FeatureCollection } from "../types";
import { isFeature } from "../helpers";
import turfBoolOverlap from "@turf/boolean-overlap";
import deepEqual from "fast-deep-equal";

/**
 * Returns all B Features that overlap with an A Feature
 * A and B must have the same geometry dimension (single or multi). Builds on @turf/boolean-overlap.
 * @param idProperty - property in Feature B to track if overlap already found.
 * Useful if multiple features have same property value and you only want the first match.
 */
export async function overlap<F extends Feature>(
  inputA: Feature | FeatureCollection,
  featuresB: F[],
  idProperty?: string
): Promise<F[]> {
  const featuresA = isFeature(inputA) ? [inputA] : inputA.features; // Normalize to an array
  let overlapFeatures: F[] = [];
  let overlapIds: string[] = [];

  featuresA.forEach((featureA) => {
    featuresB.forEach((featureB) => {
      // Don't test overlap if we already know it does
      if (idProperty) {
        const idB = featureB.properties
          ? featureB.properties[idProperty]
          : null;
        if (!overlapIds.includes(idB) && turfBoolOverlap(featureA, featureB)) {
          overlapFeatures.push(featureB);
          overlapIds.push(idB);
        }
      } else {
        if (
          overlapFeatures.findIndex((of) => deepEqual(featureB, of)) < 0 &&
          turfBoolOverlap(featureA, featureB)
        ) {
          overlapFeatures.push(featureB);
        }
      }
    });
  });

  return overlapFeatures;
}

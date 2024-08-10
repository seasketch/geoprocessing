import { Feature, Geometry } from "../types/index.js";
import { isFeature } from "../helpers/geo.js";
import { booleanOverlap as turfBoolOverlap } from "@turf/turf";
import deepEqual from "fast-deep-equal";

/**
 * Returns all B items that overlap with a A items
 * Not all Feature types are supported, see typedoc
 * A and B must have the same geometry dimension (single or multi). Builds on @turf/boolean-overlap.
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} featuresA - single or array
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} featuresB - single or array
 * @param idProperty - property in Feature B to track if overlap already found.
 * Useful if multiple features have same property value and you only want the first match.
 */
export async function booleanOverlap<B extends Feature<any>>(
  featureAInput: Feature<any> | Feature<any>[],
  featureBInput: B | B[],
  idProperty?: string
): Promise<B[]>;
export async function booleanOverlap<B extends Feature<any>>(
  featureAInput: Geometry[],
  featureBInput: B | B[],
  idProperty?: string
): Promise<B[]>;
export async function booleanOverlap<B extends Geometry>(
  featureAInput: Feature<any> | Feature<any>[],
  featureBInput: B | B[],
  idProperty?: string
): Promise<B[]>;
export async function booleanOverlap<B extends Geometry>(
  featureAInput: Geometry | Geometry[],
  featureBInput: B | B[],
  idProperty?: string
): Promise<B[]>;
export async function booleanOverlap<B>(
  featureAInput,
  featureBInput: B | B[],
  idProperty?: string
): Promise<B[]> {
  // Normalize input to array
  const featuresA = Array.isArray(featureAInput)
    ? featureAInput
    : [featureAInput];
  const featuresB = Array.isArray(featureBInput)
    ? featureBInput
    : [featureBInput];

  let overlapFeatures: B[] = [];
  let overlapIds: string[] = [];

  featuresA.forEach((featureA) => {
    featuresB.forEach((featureB) => {
      // Don't test overlap if we already know it does
      if (isFeature(featureB) && idProperty) {
        const fb = featureB as Feature;
        const idB = fb.properties ? fb.properties[idProperty] : null;
        if (!overlapIds.includes(idB) && turfBoolOverlap(featureA, featureB)) {
          overlapFeatures.push(featureB);
          overlapIds.push(idB);
        }
      } else {
        if (
          overlapFeatures.findIndex((of) => deepEqual(featureB, of)) < 0 &&
          turfBoolOverlap(featureA, featureB as any)
        ) {
          overlapFeatures.push(featureB);
        }
      }
    });
  });

  return overlapFeatures;
}

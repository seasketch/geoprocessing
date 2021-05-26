import { Feature, Geometry } from "../types";
import { isFeature } from "../helpers";
import turfBoolOverlap from "@turf/boolean-overlap";
import deepEqual from "fast-deep-equal";

/**
 * Returns all B items that overlap with an A item
 * Note that not all Feature types are supported, see typedoc
 * A and B must have the same geometry dimension (single or multi). Builds on @turf/boolean-overlap.
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>}[] featuresA array
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>}[] featuresB array
 * @param idProperty - property in Feature B to track if overlap already found.
 * Useful if multiple features have same property value and you only want the first match.
 */
export async function overlap<B extends Feature<any>>(
  featuresA: Feature<any>[],
  featuresB: B[],
  idProperty?: string
): Promise<B[]>;
export async function overlap<B extends Feature<any>>(
  featuresA: Geometry[],
  featuresB: B[],
  idProperty?: string
): Promise<B[]>;
export async function overlap<B extends Geometry>(
  featuresA: Feature<any>[],
  featuresB: B[],
  idProperty?: string
): Promise<B[]>;
export async function overlap<B extends Geometry>(
  featuresA: Geometry[],
  featuresB: B[],
  idProperty?: string
): Promise<B[]>;
export async function overlap<B>(
  featuresA,
  featuresB: B[],
  idProperty?: string
): Promise<B[]> {
  let overlapFeatures: B[] = [];
  let overlapIds: string[] = [];

  featuresA.forEach((featureA) => {
    featuresB.forEach((featureB) => {
      // Don't test overlap if we already know it does
      if (isFeature(featureB) && idProperty) {
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
          turfBoolOverlap(featureA, featureB as any)
        ) {
          overlapFeatures.push(featureB);
        }
      }
    });
  });

  return overlapFeatures;
}

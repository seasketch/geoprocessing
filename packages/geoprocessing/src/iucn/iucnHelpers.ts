import { Sketch } from "../types";
import { getJsonUserAttribute } from "../helpers";
import {
  IucnCategoryCombined,
  getIucnCategoryForActivities,
} from "./iucnProtectionLevel";

/**
 * Return Category for each sketch keyed by sketchId
 */
export const getIucnCategoryForSketches = (sketches: Sketch[]) => {
  const sketchCategoryMap = sketches.reduce<
    Record<string, IucnCategoryCombined>
  >((acc, sketch) => {
    // Get sketch allowed activities, then category
    const activities: string[] = getJsonUserAttribute(sketch, "ACTIVITIES", []);
    const category = getIucnCategoryForActivities(activities);
    return {
      ...acc,
      [sketch.properties.id]: category,
    };
  }, {});
  return sketchCategoryMap;
};

/**
 * Return Category name for each sketch keyed by sketchId
 */
export const getIucnCategoryNameForSketches = (sketches: Sketch[]) => {
  const sketchCatMap = getIucnCategoryForSketches(sketches);
  return Object.keys(sketchCatMap).reduce<Record<string, string>>(
    (sofar, sketchId) => ({
      ...sofar,
      [sketchId]: sketchCatMap[sketchId].category,
    }),
    {}
  );
};

/**
 * Return level name for each sketch keyed by sketchId
 */
export const getIucnLevelNameForSketches = (sketches: Sketch[]) => {
  const sketchCatMap = getIucnCategoryForSketches(sketches);
  return Object.keys(sketchCatMap).reduce<Record<string, string>>(
    (sofar, sketchId) => ({
      ...sofar,
      [sketchId]: sketchCatMap[sketchId].level,
    }),
    {}
  );
};

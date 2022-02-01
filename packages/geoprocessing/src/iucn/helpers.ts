import { Sketch } from "../types";
import { getJsonUserAttribute } from "../helpers";
import { IucnCategoryCombined, iucnCategoriesMap } from "./iucnProtectionLevel";

/**
 * Given list of allowed activities in the sketch, returns the highest category allowable
 * The lack of an activity assumes it is not allowed
 * @param sketch
 * @param activityAttrib
 */
export const getIucnCategoryForActivities = (
  activities: string[]
): IucnCategoryCombined => {
  if (activities.length === 0) return iucnCategoriesMap["1a"];

  // Get first category where all activities allowed in sketch are allowed by the category
  let firstCategory: IucnCategoryCombined | undefined = undefined;
  const categoryIds = Object.keys(iucnCategoriesMap).sort();
  for (const categoryId of categoryIds) {
    const curCategory = iucnCategoriesMap[categoryId];
    const matchCategory = activities
      .map((act) => curCategory.allowedActivities.includes(act))
      .reduce((acc, hasActivity) => acc && hasActivity, true);
    if (matchCategory) {
      firstCategory = curCategory;
      break;
    }
  }
  if (!firstCategory) firstCategory = iucnCategoriesMap["None"];
  return firstCategory;
};

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

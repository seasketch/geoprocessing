import { MetricGroup } from "../types/metricGroup.js";
import { keyBy } from "./keyBy.js";

/**
 * Returns the objectiveId assigned to the given MetricGroup.
 * If classId provided, returns the objective ID assigned to data class with that classId, else fallback to metricGroup objectiveId.
 * @param metricGroup the metricGroup to get the objective for
 * @param classId the classId to get the objective for
 * @returns objectiveId
 * @throws if data class does not exist with classId
 * @throws if no objectiveId found for metricGroup or its class
 */
export const getMetricGroupObjectiveId = (
  metricGroup: MetricGroup,
  classId?: string,
): string => {
  if (classId) {
    const classesByName = keyBy(
      metricGroup.classes,
      (curClass) => curClass.classId,
    );
    const classObjective = classesByName[classId];
    if (!classObjective) {
      throw new Error(
        `Data class with classId = ${classId} not found in metricGroup ${metricGroup.metricId}`,
      );
    }
    if (classObjective.objectiveId) {
      return classObjective.objectiveId; // return class level objectiveId if available
    }
  }
  if (!metricGroup.objectiveId) {
    throw new Error(
      `No objectiveId found for metricGroup ${metricGroup.metricId} or its class ${classId}`,
    );
  }
  return metricGroup.objectiveId!; // fallback to metricGroup objectiveId
};

/**
 * Returns array of objective IDs for the given MetricGroup.
 * If at least one class has an objectiveId assigned, then it returns those, missing classes with no objectiveId get the top-level objectiveId
 * If no class-level objectives are found, then it returns the top-level objectiveId
 * If no objectives are found, returns an empty array
 * @param metricGroup the metricGroup to get the objectives for
 * @returns array of objectiveIds
 */
export const getMetricGroupObjectiveIds = (metricGroup: MetricGroup) => {
  const classIds = metricGroup.classes.reduce<string[]>(
    (idsSoFar, curClass) => {
      return curClass.objectiveId
        ? idsSoFar.concat(curClass.objectiveId)
        : idsSoFar.concat(metricGroup.objectiveId || []);
    },
    [],
  );

  // If at least one class has an objectiveId, return those
  if (classIds.length > 0) {
    return [...new Set(classIds)]; // deduplicate
  }

  // fallback to top-level objectiveId
  if (metricGroup.objectiveId) {
    return [metricGroup.objectiveId];
  }

  return []; // no objectives found
};

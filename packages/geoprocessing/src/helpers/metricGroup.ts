import { MetricGroup } from "../types/metricGroup.js";
import { keyBy } from "./keyBy.js";

/**
 * Returns the top-level objective assigned for the given MetricGroup.
 * If a classID is also passed, returns the objective ID for that class within the metric group */
export const getMetricGroupObjectiveId = (
  metricGroup: MetricGroup,
  classId?: string,
) => {
  if (metricGroup.objectiveId) return metricGroup.objectiveId;

  if (classId) {
    const classesByName = keyBy(
      metricGroup.classes,
      (curClass) => curClass.classId,
    );
    const classObjectiveId = classesByName[classId].objectiveId;
    if (classObjectiveId) return classObjectiveId;
  }
  throw new Error(`Expected objectiveId for metricGroup or class ${classId}`);
};

/** Returns array of all objective IDs configured for the given MetricGroup.
 * If a class does not have an objectiveId assigned, then it gets the top-level
 * objectiveId
 */
export const getMetricGroupObjectiveIds = (metricGroup: MetricGroup) => {
  const classIds = metricGroup.classes.reduce<string[]>(
    (idsSoFar, curClass) => {
      return curClass.objectiveId
        ? idsSoFar.concat(curClass.objectiveId)
        : idsSoFar;
    },
    [],
  );

  // add top-level objective if also defined
  const finalIds = metricGroup.objectiveId
    ? [metricGroup.objectiveId, ...classIds]
    : classIds;

  // deduplicate
  return [...new Set(finalIds)];
};

import {
  Objective,
  ObjectiveId,
  ClassificationId,
  OBJECTIVE_YES,
} from "../types/objective.js";
import { keyBy } from "./keyBy.js";

import { getKeys } from "./ts.js";

/** find and return objectives from passed objectives */
export const getObjectiveById = (
  objectiveId: string,
  objectives: Objective[]
): Objective => {
  const obj = objectives.find((obj) => obj.objectiveId === objectiveId);
  if (!obj) {
    throw new Error(`Objective not found - ${objectiveId}`);
  } else {
    return obj;
  }
};

/**
 * Returns an object mapping objective ID to ID of first classification that counts toward objective
 * @param objectives - set of objectives
 */
export const getMinYesCountMap = (
  objectives: Objective[]
): Record<ObjectiveId, ClassificationId> => {
  const objectiveMap = keyBy(objectives, (obj) => obj.objectiveId);
  return getKeys(objectiveMap).reduce((accSoFar, objectiveId) => {
    const curObjective = objectiveMap[objectiveId];
    const curObjectiveCountsKeys = getKeys(curObjective.countsToward);
    const firstYesKey =
      curObjectiveCountsKeys.findIndex(
        (level) => curObjective.countsToward[level] !== OBJECTIVE_YES
      ) - 1;
    return {
      ...accSoFar,
      [objectiveId]: curObjectiveCountsKeys[firstYesKey],
    };
  }, {});
};

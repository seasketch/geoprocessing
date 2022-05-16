import {
  ObjectiveGroup,
  ObjectiveId,
  ClassificationId,
  OBJECTIVE_YES,
} from "../types/objective";
import { getKeys } from "./ts";

/**
 * Returns an object mapping objective ID to ID of first classification that counts toward objective
 * @param objectives - set of objectives
 */
export const getMinYesCountMap = (
  objectives: ObjectiveGroup
): Record<ObjectiveId, ClassificationId> => {
  return getKeys(objectives).reduce((accSoFar, objectiveId) => {
    const curObjective = objectives[objectiveId];
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

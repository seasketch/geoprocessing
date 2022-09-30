import { MetricGroup } from "../types/metricGroup";
import { keyBy } from "./keyBy";

export const getMetricGroupObjectiveId = (
  metricGroup: MetricGroup,
  classId?: string
) => {
  if (metricGroup.objectiveId) return metricGroup.objectiveId;

  if (classId) {
    const classesByName = keyBy(
      metricGroup.classes,
      (curClass) => curClass.classId
    );
    const classObjectiveId = classesByName[classId].objectiveId;
    if (classObjectiveId) return classObjectiveId;
  }
  throw new Error(`Expected objectiveId for metricGroup or class ${classId}`);
};

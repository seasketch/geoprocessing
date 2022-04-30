import React from "react";
import { OBJECTIVE_YES, OBJECTIVE_NO, ObjectiveAnswer } from "../../types";
import { RbcsObjective } from "../rbcs";
import { percentWithEdge } from "../../helpers";
import { ObjectiveStatus } from "../../components/ObjectiveStatus";

export type RbcsNetworkObjectiveRenderMsgFunction = (
  objective: RbcsObjective,
  objectiveMet: ObjectiveAnswer
) => JSX.Element;

export interface RbcsNetworkObjectiveProps {
  /** Objective to display status */
  objective: RbcsObjective;
  /** Answer to whether objective is met */
  objectiveMet: ObjectiveAnswer;
  /** optional custom objective message */
  renderMsg?: RbcsNetworkObjectiveRenderMsgFunction;
}

/**
 * Displays status toward meeting Network objective
 */
export const RbcsNetworkObjectiveStatus: React.FunctionComponent<RbcsNetworkObjectiveProps> =
  ({ objective, objectiveMet, renderMsg }) => {
    const msg = renderMsg
      ? renderMsg(objective, objectiveMet)
      : defaultMsg(objective, objectiveMet);

    return <ObjectiveStatus status={objectiveMet} msg={msg} />;
  };

const defaultMsg = (
  objective: RbcsObjective,
  objectiveMet: ObjectiveAnswer
) => {
  if (objectiveMet === OBJECTIVE_YES) {
    return (
      <>
        This plan meets the objective of protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  } else if (objectiveMet === OBJECTIVE_NO) {
    return (
      <>
        This plan <b>does not</b> meet the objective of protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  } else {
    return (
      <>
        This plan <b>may</b> meet the objective of protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  }
};

import React from "react";
import { RbcsObjective, RbcsMpaProtectionLevel } from "../rbcs";
import { OBJECTIVE_YES, OBJECTIVE_NO } from "../../types";
import { percentWithEdge } from "../../helpers";
import { ObjectiveStatus } from "../../components";

export type RbcsMpaObjectiveRenderMsgFunction = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => JSX.Element;

export interface RbcsMpaObjectiveStatusProps {
  /** RBCS protection level for MPA to give status for */
  level: RbcsMpaProtectionLevel;
  /** RBCS objective to weigh protection level against */
  objective: RbcsObjective;
  /** optional custom objective message */
  renderMsg?: RbcsMpaObjectiveRenderMsgFunction;
}

export const RbcsMpaObjectiveStatus: React.FunctionComponent<RbcsMpaObjectiveStatusProps> =
  ({ level, objective, renderMsg }) => {
    const msg = renderMsg
      ? renderMsg(objective, level)
      : defaultMsg(objective, level);

    return <ObjectiveStatus status={objective.countsToward[level]} msg={msg} />;
  };

const defaultMsg = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => {
  if (objective.countsToward[level] === OBJECTIVE_YES) {
    return (
      <>
        This MPA counts towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  } else if (objective.countsToward[level] === OBJECTIVE_NO) {
    return (
      <>
        This MPA <b>does not</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  } else {
    return (
      <>
        This MPA <b>may</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of planning area.
      </>
    );
  }
};

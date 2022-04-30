import React from "react";
import { RbcsMpaObjectiveStatus } from "./RbcsMpaObjectiveStatus";
import { ReportDecorator, CardDecorator } from "../../components/storybook";
import { percentWithEdge, getKeys } from "../../helpers";
import { RbcsObjective, RbcsMpaProtectionLevel } from "../types";
import { OBJECTIVE_YES, OBJECTIVE_NO } from "../../types";

export default {
  component: RbcsMpaObjectiveStatus,
  title: "Components/Rbcs/RbcsMpaObjective",
  decorators: [CardDecorator, ReportDecorator],
};

const objective: RbcsObjective = {
  id: "eez",
  shortDesc: "30% protected",
  target: 0.3,
  countsToward: {
    "Fully Protected Area": "yes",
    "Highly Protected Area": "yes",
    "Moderately Protected Area": "maybe",
    "Poorly Protected Area": "no",
    "Unprotected Area": "no",
  },
};

export const simple = () => {
  const levels = getKeys(objective.countsToward);
  return (
    <>
      <p>Based on the following objective {JSON.stringify(objective)}:</p>
      {levels.map((level) => (
        <>
          <p>{`If MPA has protection level: ${level}`}</p>
          <RbcsMpaObjectiveStatus level={level} objective={objective} />
        </>
      ))}
    </>
  );
};

export const customMessageRenderProp = () => {
  const levels = getKeys(objective.countsToward);
  return (
    <>
      <p>Based on the following objective {JSON.stringify(objective)}:</p>
      {levels.map((level) => (
        <>
          <p>{`If MPA has protection level: ${level}`}</p>
          <RbcsMpaObjectiveStatus
            level={level}
            objective={objective}
            renderMsg={() => customRenderMsg(objective, level)}
          />
        </>
      ))}
    </>
  );
};

const customRenderMsg = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => {
  if (objective.countsToward[level] === OBJECTIVE_YES) {
    return (
      <>
        This most definitely counts towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Lunar waters 🌙.
      </>
    );
  } else if (objective.countsToward[level] === OBJECTIVE_NO) {
    return (
      <>
        This most definitely <b>does not</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Lunar waters 🌙.
      </>
    );
  } else {
    return (
      <>
        This most definitely <b>may</b> count towards protecting{" "}
        <b>{percentWithEdge(objective.target)}</b> of Lunar waters 🌙.
      </>
    );
  }
};

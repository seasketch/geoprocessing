import React from "react";
import { RbcsMpaObjectiveStatus } from "./RbcsMpaObjectiveStatus.js";
import {
  ReportDecorator,
  CardDecorator,
} from "../../components/storybook/index.js";
import { percentWithEdge, getKeys } from "../../helpers/index.js";
import { RbcsObjective, RbcsMpaProtectionLevel } from "../types.js";
import { OBJECTIVE_YES, OBJECTIVE_NO } from "../../types/index.js";

export default {
  component: RbcsMpaObjectiveStatus,
  title: "Components/Rbcs/RbcsMpaObjective",
  decorators: [CardDecorator, ReportDecorator],
};

const objective: RbcsObjective = {
  objectiveId: "eez",
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
      {levels.map((level, index) => (
        <div key={index}>
          <p>{`If MPA has protection level: ${level}`}</p>
          <RbcsMpaObjectiveStatus level={level} objective={objective} />
        </div>
      ))}
    </>
  );
};

export const customMessageRenderProp = () => {
  const levels = getKeys(objective.countsToward);
  return (
    <>
      <p>Based on the following objective {JSON.stringify(objective)}:</p>
      {levels.map((level, index) => (
        <div key={index}>
          <p>{`If MPA has protection level: ${level}`}</p>
          <RbcsMpaObjectiveStatus
            level={level}
            objective={objective}
            renderMsg={() => customRenderMsg(objective, level)}
          />
        </div>
      ))}
    </>
  );
};

const customRenderMsg = (
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel,
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

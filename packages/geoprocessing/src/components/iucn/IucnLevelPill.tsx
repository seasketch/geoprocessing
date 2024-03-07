import React, { ReactNode } from "react";
import { GroupPill } from "../Pill.js";

export interface IucnLevelPillProps {
  level: string;
  children: ReactNode;
}

const groupColorMap = {
  full: "#BEE4BE",
  high: "#FFE1A3",
  low: "#F7A6B4",
};

export const IucnLevelPill: React.FunctionComponent<IucnLevelPillProps> = ({
  level,
  children,
}) => {
  return (
    <GroupPill groupColorMap={groupColorMap} group={level}>
      {children}
    </GroupPill>
  );
};

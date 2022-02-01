import React, { ReactNode } from "react";
import { GroupCircle } from "..";

export interface IucnLevelCircleProps {
  children: ReactNode;
  level: string;
}

const groupColorMap = {
  full: "#BEE4BE",
  high: "#FFE1A3",
  low: "#F7A6B4",
};

export const IucnLevelCircle: React.FunctionComponent<IucnLevelCircleProps> = ({
  level,
  children,
}) => {
  return (
    <GroupCircle groupColorMap={groupColorMap} group={level}>
      {children}
    </GroupCircle>
  );
};

export interface IucnLevelCircleRowProps {
  level: string;
  circleText?: string | number;
  rowText?: string | ReactNode;
}

export const IucnLevelCircleRow: React.FunctionComponent<
  IucnLevelCircleRowProps
> = ({ level, circleText, rowText }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IucnLevelCircle level={level}>{circleText || " "}</IucnLevelCircle>
      <span style={{ marginLeft: 5 }}>{rowText || ""}</span>
    </div>
  );
};

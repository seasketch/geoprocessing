import React, { ReactNode } from "react";
import { Circle } from "../Circle";

export interface LevelCircleProps {
  children: ReactNode;
  level: string;
}

export const LevelCircle: React.FunctionComponent<LevelCircleProps> = ({
  level,
  children,
}) => {
  return (
    <Circle
      color={
        level === "full" ? "#BEE4BE" : level === "high" ? "#FFE1A3" : "#F7A6B4"
      }
    >
      {children}
    </Circle>
  );
};

export interface LevelCircleRowProps {
  level: string;
  circleText?: string | number;
  rowText?: string | ReactNode;
}

export const LevelCircleRow: React.FunctionComponent<LevelCircleRowProps> = ({
  level,
  circleText,
  rowText,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <LevelCircle level={level}>{circleText || " "}</LevelCircle>
      <span style={{ marginLeft: 5 }}>{rowText || ""}</span>
    </div>
  );
};

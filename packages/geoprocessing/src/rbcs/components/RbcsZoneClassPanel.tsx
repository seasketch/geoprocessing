import React from "react";
import { RbcsZoneRegIcon } from "./RbcsIcons";
import { getZoneClassificationName } from "..";

export interface RbcsPanelProps {
  value: number;
  size?: number;
}

/**
 * Single-sketch status panel for MPA regulation-based classification
 */
export const RbcsZoneClassPanel: React.FunctionComponent<RbcsPanelProps> = ({
  value,
  size = 24,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ paddingRight: 10 }}>
        <RbcsZoneRegIcon value={value} size={size} />
      </div>
      <div style={{ fontSize: 18 }}>{getZoneClassificationName(value)}</div>
    </div>
  );
};

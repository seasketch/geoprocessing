import React from "react";
import { PointyCircle } from "./PointyCircle";
import { RbcsIcon } from "./RbcsIcons";

export interface RbcsMpaClassPanelProps {
  value: number;
  displayName: string;
  size?: number;
  displayValue?: boolean;
  /** Group to use for this circle */
  group?: string;
  /** Mapping of group names to color */
  groupColorMap?: Record<string, string>;
}

/**
 * Sketch collection status panel for MPA regulation-based classification
 */
export const RbcsMpaClassPanel: React.FunctionComponent<RbcsMpaClassPanelProps> =
  ({ value, displayName, size, displayValue = true, group, groupColorMap }) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ paddingRight: 10 }}>
          {group && groupColorMap ? (
            <PointyCircle size={size} color={groupColorMap[group]}>
              {displayValue}
            </PointyCircle>
          ) : (
            <RbcsIcon value={value} size={size} displayValue={displayValue} />
          )}
        </div>
        <div style={{ fontSize: 18 }}>{displayName}</div>
      </div>
    );
  };

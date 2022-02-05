import React, { ReactNode } from "react";
import { GroupCircle } from "../Circle";

export interface GroupCircleRowProps {
  group: string;
  groupColorMap: Record<string, string>;
  circleText?: string | number;
  rowText?: string | ReactNode;
}

/**
 * GroupCircle with layout for use in table row
 */
export const GroupCircleRow: React.FunctionComponent<GroupCircleRowProps> = ({
  group,
  groupColorMap,
  circleText,
  rowText,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <GroupCircle group={group} groupColorMap={groupColorMap}>
        {circleText || " "}
      </GroupCircle>
      <span style={{ marginLeft: 5 }}>{rowText || ""}</span>
    </div>
  );
};

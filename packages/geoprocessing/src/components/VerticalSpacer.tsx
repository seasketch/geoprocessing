import React from "react";

export interface VerticalSpacerProps {
  height?: React.CSSProperties["height"];
}

export const VerticalSpacer: React.FunctionComponent<VerticalSpacerProps> = ({
  height = "1rem",
}) => {
  return <div style={{ height, width: "100%" }}></div>;
};

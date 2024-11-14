import React from "react";
import { InfoCircleFill } from "@styled-icons/bootstrap";

export interface StatusProps {
  msg: JSX.Element;
  size?: number;
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

export const InfoStatus: React.FunctionComponent<StatusProps> = ({
  msg,
  size = 36,
  style = {},
}) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      aria-label="Info"
      role="status"
    >
      <InfoCircleFill
        size={size}
        style={{ color: "#83C6E6", paddingRight: 10, ...style }}
        aria-label="Info icon"
      />
      {msg}
    </div>
  );
};

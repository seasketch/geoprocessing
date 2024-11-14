import React from "react";
import { ExclamationCircleFill } from "@styled-icons/bootstrap";

export interface ErrorStatusProps {
  msg: JSX.Element;
  size?: number;
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

export const ErrorStatus: React.FunctionComponent<ErrorStatusProps> = ({
  msg,
  size = 36,
  style = {},
}) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      aria-label="Error"
      role="status"
    >
      <ExclamationCircleFill
        size={size}
        style={{ color: "#ea4848", paddingRight: 10, flexShrink: 0, ...style }}
        aria-label="Error icon"
      />
      <div aria-label="Error message">{msg}</div>
    </div>
  );
};

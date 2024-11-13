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
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ paddingRight: 10 }}>
        <ExclamationCircleFill
          size={size}
          style={{ color: "#ea4848", ...style }}
          aria-label="Error icon"
        />
      </div>
      <div>{msg}</div>
    </div>
  );
};

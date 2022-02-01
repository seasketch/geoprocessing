import React from "react";
import { InfoCircleFill } from "@styled-icons/bootstrap";

export interface InfoStatusProps {
  msg: JSX.Element;
  size?: number;
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

export const InfoStatus: React.FunctionComponent<InfoStatusProps> = ({
  msg,
  size = 36,
  style = {},
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ paddingRight: 10 }}>
        <InfoCircleFill
          size={size}
          style={{ ...{ color: "#83C6E6" }, ...style }}
        />
      </div>
      <div>{msg}</div>
    </div>
  );
};

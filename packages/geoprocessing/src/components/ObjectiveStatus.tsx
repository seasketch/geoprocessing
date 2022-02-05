import React from "react";
import {
  CheckCircleFill,
  XCircleFill,
  QuestionCircleFill,
} from "@styled-icons/bootstrap";

export interface ObjectiveStatusProps {
  status: "yes" | "no" | "maybe";
  msg: JSX.Element;
  size?: number;
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

export const ObjectiveStatus: React.FunctionComponent<ObjectiveStatusProps> = ({
  status,
  msg,
  size = 36,
  style = {},
}) => {
  let icon: JSX.Element;
  switch (status) {
    case "yes":
      icon = (
        <CheckCircleFill
          size={size}
          style={{ ...{ color: "#78c679" }, ...style }}
        />
      );
      break;
    case "maybe":
      icon = (
        <QuestionCircleFill
          size={size}
          style={{ ...{ color: "#fec44f" }, ...style }}
        />
      );
      break;
    case "no":
      icon = (
        <XCircleFill
          size={size}
          style={{ ...{ color: "#ED2C7C" }, ...style }}
        />
      );
      break;
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ paddingRight: 10 }}>{icon}</div>
      <div>{msg}</div>
    </div>
  );
};

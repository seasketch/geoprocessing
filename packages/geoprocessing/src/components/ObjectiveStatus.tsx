import React from "react";
import {
  CheckCircleFill,
  XCircleFill,
  QuestionCircleFill,
} from "@styled-icons/bootstrap";
import { ObjectiveAnswer } from "../types/objective.js";

export interface ObjectiveStatusProps {
  status: ObjectiveAnswer;
  msg: JSX.Element;
  size?: number;
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

export const ObjectiveStatus: React.FunctionComponent<ObjectiveStatusProps> = ({
  status,
  msg,
  size = 30,
  style = {},
}) => {
  let icon: JSX.Element = <></>;
  switch (status) {
    case "yes": {
      icon = (
        <CheckCircleFill
          size={size}
          style={{
            color: "#78c679",
            paddingRight: 10,
            flexShrink: 0,
            ...style,
          }}
          aria-label="Yes"
        />
      );
      break;
    }
    case "maybe": {
      icon = (
        <QuestionCircleFill
          size={size}
          style={{
            color: "#fec44f",
            paddingRight: 10,
            flexShrink: 0,
            ...style,
          }}
          aria-label="Maybe"
        />
      );
      break;
    }
    case "no": {
      icon = (
        <XCircleFill
          size={size}
          style={{
            color: "#ED2C7C",
            paddingRight: 10,
            flexShrink: 0,
            ...style,
          }}
          aria-label="No"
        />
      );
      break;
    }
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      aria-label="Objective"
      role="status"
    >
      {icon}
      <div aria-label="Objective message">{msg}</div>
    </div>
  );
};

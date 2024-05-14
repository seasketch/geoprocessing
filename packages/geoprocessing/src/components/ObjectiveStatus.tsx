import React from "react";
import {
  CheckCircleFill,
  XCircleFill,
  QuestionCircleFill,
} from "@styled-icons/bootstrap";
import { ObjectiveAnswer } from "../types/objective.js";
import { styled } from "styled-components";

export interface ObjectiveStatusProps {
  status: ObjectiveAnswer;
  msg: JSX.Element;
  size?: number;
  style?: React.HTMLAttributes<HTMLElement>["style"];
}

const TableStyled = styled.div`
  .container {
    display: flex;
    margin: 10px 0px 10px 0px;
  }
  .icon {
    padding-right: 10px;
  }
`;

export const ObjectiveStatus: React.FunctionComponent<ObjectiveStatusProps> = ({
  status,
  msg,
  size = 30,
  style = {},
}) => {
  let icon: JSX.Element = <></>;
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
    <TableStyled>
      <div className="container">
        <div className="icon">{icon}</div>
        <div>{msg}</div>
      </div>
    </TableStyled>
  );
};

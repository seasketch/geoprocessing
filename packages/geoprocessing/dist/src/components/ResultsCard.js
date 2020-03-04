import React from "react";
import Card from "./Card";
import { useFunction } from "../hooks/useFunction";
// @ts-ignore
import styled from "styled-components";
import Skeleton from "./Skeleton";
const DefaultSkeleton = () => (React.createElement("p", null,
    React.createElement(Skeleton, null),
    React.createElement(Skeleton, null),
    React.createElement(Skeleton, null),
    React.createElement(Skeleton, { style: { width: "25%" } })));
// @ts-ignore
const ErrorIndicator = styled.div `
  display: inline-block;
  font-weight: bold;
  font-size: 18px;
  line-height: 1em;
  background-color: #ea4848;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  color: white;
  text-align: center;
  margin-right: 8px;
  ::before {
    position: relative;
    bottom: -1px;
    content: "!";
  }
`;
function ResultsCard(props) {
    if (!props.functionName) {
        throw new Error("No function specified for ResultsCard");
    }
    const { task, loading, error } = useFunction(props.functionName);
    if (error) {
        return (React.createElement(Card, { title: props.title },
            React.createElement("p", { role: "alert" },
                React.createElement(ErrorIndicator, null),
                error)));
    }
    else {
        return (React.createElement(Card, { title: props.title }, loading || !task ? (props.skeleton || React.createElement(DefaultSkeleton, null)) : (React.createElement(React.Fragment, null, props.children(task.data)))));
    }
}
export default ResultsCard;
//# sourceMappingURL=ResultsCard.js.map
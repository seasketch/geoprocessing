import React, { useState, ReactNode } from "react";
import Card, { Props } from "./Card";
import { useFunction } from "../hooks/useFunction";
// @ts-ignore
import styled, { keyframes } from "styled-components";
import Skeleton from "./Skeleton";

export interface ResultsCardProps<T> extends Props {
  functionName: string;
  children: (results: T) => ReactNode;
  skeleton?: ReactNode;
}

const DefaultSkeleton = () => (
  <p>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton style={{ width: "25%" }} />
  </p>
);

// styled-components are needed here to use the ::before pseudo selector
// @ts-ignore
const ErrorIndicator = styled.div`
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
//@ts-ignore
const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;
//@ts-ignore
const ProgressBar = styled.div`
  background: #5ac8fa;
  height: 20px;
  animation: ${fill} linear 20;
  animation-duration: ${(props: any) => props.duration + "s"};
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  &::before {
    content: "hi";
  }
`;
function ResultsCard<T>(props: ResultsCardProps<T>) {
  if (!props.functionName) {
    throw new Error("No function specified for ResultsCard");
  }
  const { task, loading, error } = useFunction(props.functionName);
  let taskEstimate = 5;
  if (task && task.estimate) {
    taskEstimate = Math.round(task.estimate + 1000 / 1000);
  }
  if (error) {
    return (
      <Card title={props.title}>
        <p role="alert">
          <ErrorIndicator />
          {error}
        </p>
      </Card>
    );
  } else {
    return (
      <Card title={props.title}>
        {loading || !task ? (
          props.skeleton || <ProgressBar duration={taskEstimate} />
        ) : (
          <>{props.children(task.data as T)}</>
        )}
      </Card>
    );
  }
}

export default ResultsCard;

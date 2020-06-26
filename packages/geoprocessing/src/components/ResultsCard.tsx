import React, { useState, ReactNode } from "react";
import Card, { Props } from "./Card";
import { useFunction } from "../hooks/useFunction";
// @ts-ignore
import styled from "styled-components";
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

function ResultsCard<T>(props: ResultsCardProps<T>) {
  if (!props.functionName) {
    throw new Error("No function specified for ResultsCard");
  }
  const { task, loading, error } = useFunction(props.functionName);
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
      <Card title={props.title + " : " + task?.wss}>
        {loading || !task ? (
          props.skeleton || <DefaultSkeleton />
        ) : (
          <>{props.children(task.data as T)}</>
        )}
      </Card>
    );
  }
}

export default ResultsCard;

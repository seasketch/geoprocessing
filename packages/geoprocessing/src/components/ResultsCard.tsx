import React, { ReactNode } from "react";
import Card, { Props } from "./Card";
import { useFunction } from "../hooks/useFunction";
import styled from "styled-components";
import Skeleton from "./Skeleton";
import { ProgressBar, ProgressBarWrapper } from "./ProgressBar";

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
export const EstimateLabel = styled.div`
  height: 20px;
  margin-top: 5px;
  padding-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  font-style: italic;
  width: 100%;
  text-align: center;
  display: none;
`;

function ResultsCard<T>(props: ResultsCardProps<T>) {
  if (!props.functionName) {
    throw new Error("No function specified for ResultsCard");
  }
  let { task, loading, error } = useFunction(props.functionName);
  let taskEstimate = 5;
  if (task && task.estimate) {
    taskEstimate = Math.round(task.estimate / 1000);
  }

  let showLabel = false;
  if (task && task.estimate) {
    showLabel = true;
  }
  if (!loading) {
    if (!task?.data) {
      error = task?.error;
    }
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
        {loading ? (
          <>
            {props.skeleton || <DefaultSkeleton />}
            <ProgressBarWrapper>
              <ProgressBar duration={taskEstimate} />
            </ProgressBarWrapper>
          </>
        ) : (
          <>{props.children(task?.data as T)}</>
        )}
      </Card>
    );
  }
}

export default ResultsCard;

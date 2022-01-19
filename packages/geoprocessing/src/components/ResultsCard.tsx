import React, { ReactNode } from "react";
import Card, { CardProps } from "./Card";
import { useFunction } from "../hooks/useFunction";
import styled from "styled-components";
import Skeleton from "./Skeleton";
import { ProgressBar, ProgressBarWrapper } from "./ProgressBar";
import { ReportError } from "./ReportError";

export interface ResultsCardProps<T> extends CardProps {
  functionName: string;
  children: (results: T) => ReactNode;
  skeleton?: ReactNode;
  titleStyle?: React.CSSProperties;
}

const DefaultSkeleton = () => (
  <div>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton style={{ width: "25%" }} />
  </div>
);

// styled-components are needed here to use the ::before pseudo selector
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

function ResultsCard<T>({
  functionName,
  skeleton,
  children,
  ...otherProps
}: ResultsCardProps<T>) {
  if (!functionName) {
    throw new Error("No function specified for ResultsCard");
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "1em",
    fontWeight: 500,
    color: "#6C7282",
    marginBottom: "1.5em",
    ...(otherProps.titleStyle || {}),
  };
  const cardProps = { ...otherProps, titleStyle };

  let { task, loading, error } = useFunction(functionName);
  let taskEstimate = 5;
  if (task && task.estimate) {
    taskEstimate = Math.round(task.estimate / 1000);
  }

  let showLabel = false;
  if (task && task.estimate) {
    showLabel = true;
  }
  if (task && !task.data && !loading) {
    if (task.error) {
      error = task.error;
    } else {
      error = "Report run completed, but no results returned";
    }
  }

  let contents: JSX.Element;
  if (error) {
    contents = (
      <div role="alert">
        <ErrorIndicator />
        {error}
      </div>
    );
  } else if (loading) {
    contents = (
      <>
        {skeleton || <DefaultSkeleton />}
        <ProgressBarWrapper>
          <ProgressBar duration={taskEstimate} />
        </ProgressBarWrapper>
      </>
    );
  } else if (task && task.data) {
    contents = <>{children(task.data as T)}</>;
  } else {
    throw new Error(); // trigger ReportError boundary
  }

  return (
    <ReportError>
      <Card {...cardProps}>{contents}</Card>
    </ReportError>
  );
}

export default ResultsCard;

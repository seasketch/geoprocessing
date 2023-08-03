import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Card, { CardProps } from "./Card";
import { useFunction } from "../hooks/useFunction";
import styled from "styled-components";
import Skeleton from "./Skeleton";
import { ProgressBar, ProgressBarWrapper } from "./ProgressBar";
import { ReportError } from "./ReportError";
import { GeoprocessingRequestParams } from "../types";

export interface ResultsCardProps<T> extends CardProps {
  functionName: string;
  children: (results: T) => ReactNode;
  skeleton?: ReactNode;
  title?: string | ReactNode;
  titleStyle?: React.CSSProperties;
  /** Assumes caller will provide card in children to use results (e.g. ToolbarCard with DataDownload). Shows a simple card until loading complete */
  useChildCard?: boolean;
  /** Additional runtime parameters from report client for geoprocessing function. */
  extraParams?: GeoprocessingRequestParams;
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

export function ResultsCard<T>({
  functionName,
  skeleton,
  children,
  title,
  titleStyle = {},
  style = {},
  useChildCard = false,
  extraParams = {},
}: ResultsCardProps<T>) {
  if (!functionName) {
    throw new Error("No function specified for ResultsCard");
  }

  const { t } = useTranslation();

  const resultsCardNoResultMsg = t(
    "ResultsCard - no result message",
    "Report run completed, but no results returned"
  );

  const cardProps = {
    style,
    title,
    titleStyle,
  };

  let { task, loading, error } = useFunction(functionName, extraParams);
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
      error = resultsCardNoResultMsg;
    }
  }

  let contents: JSX.Element;
  if (error) {
    contents = (
      <Card {...cardProps}>
        <div role="alert">
          <ErrorIndicator />
          {error}
        </div>
      </Card>
    );
  } else if (loading) {
    contents = (
      <Card {...cardProps}>
        {skeleton || <DefaultSkeleton />}
        <ProgressBarWrapper>
          <ProgressBar duration={taskEstimate} />
        </ProgressBarWrapper>
      </Card>
    );
  } else if (task && task.data) {
    const renderedChildren = children(task.data as T);
    if (useChildCard) {
      // Assume caller will provide card in children
      contents = <>{renderedChildren}</>;
    } else {
      // Default card
      contents = <Card {...cardProps}>{renderedChildren}</Card>;
    }
  } else {
    throw new Error(); // trigger ReportError boundary
  }

  return <ReportError>{contents}</ReportError>;
}

export default ResultsCard;

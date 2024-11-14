import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Card from "./Card.js";
import { useFunction } from "../hooks/useFunction.js";
import { styled } from "styled-components";
import Skeleton from "./Skeleton.js";
import { ProgressBar, ProgressBarWrapper } from "./ProgressBar.js";
import { ReportError } from "./ReportError.js";
import { GeoprocessingRequestParams } from "../types/service.js";
import { ErrorStatus } from "./ErrorStatus.js";

export interface ResultsCardProps<T> {
  functionName: string;
  children: (results: T) => ReactNode;
  skeleton?: ReactNode;
  title?: string | ReactNode;
  titleStyle?: React.CSSProperties;
  style?: object;
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
    "Report run completed, but no results returned",
  );

  const cardProps = {
    style,
    title,
    titleStyle,
  };

  const { task, loading, error } = useFunction(functionName, extraParams);
  let theError = error;
  let taskEstimate = 5;
  if (task && task.estimate) {
    taskEstimate = Math.round(task.estimate / 1000);
  }

  if (task && !task.data && !loading) {
    if (task.error) {
      theError = task.error;
    } else {
      theError = resultsCardNoResultMsg;
    }
  }

  let contents: JSX.Element;
  if (theError) {
    contents = (
      <Card {...cardProps}>
        <div role="alert" aria-label="Error alert">
          <ErrorStatus msg={<>{theError}</>} />
        </div>
      </Card>
    );
  } else if (loading) {
    contents = (
      <Card {...cardProps}>
        <div role="progressbar" aria-label="Awaiting results">
          {skeleton || <DefaultSkeleton />}
          <ProgressBarWrapper>
            <ProgressBar $duration={taskEstimate} />
          </ProgressBarWrapper>
        </div>
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
    throw new Error("ResultsCard error"); // trigger ReportError boundary
  }

  return <ReportError>{contents}</ReportError>;
}

export default ResultsCard;

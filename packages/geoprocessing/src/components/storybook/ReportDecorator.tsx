import React from "react";
import { ReportContextValue } from "../../context/index.js";
import { ReportStoryLayout } from "./ReportStoryLayout.js";

/**
 * Decorator that renders a story into ReportStoryLayout.
 */
export const ReportDecorator = (storyFn): JSX.Element => {
  return <ReportStoryLayout>{storyFn()}</ReportStoryLayout>;
};
export default ReportDecorator;

/**
 * Think of this as a ReportDecorator generator, that allows you to pass in context and override the default
 * The only reason to use this instead of ReportDecorator directly is to pass context
 */
export const createReportDecorator =
  (reportContext?: Partial<ReportContextValue>) =>
  // eslint-disable-next-line react/display-name
  (storyFn): JSX.Element => {
    return (
      <ReportStoryLayout value={reportContext}>{storyFn()}</ReportStoryLayout>
    );
  };

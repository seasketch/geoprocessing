import React from "react";
import Card from "./Card";
import { ReportWindow } from "./ReportDecorator";
import { ReportContext } from "../storybook";
import { genSampleSketchContext } from "../helpers";

/**
 * ReportDecorator that wraps the story in a Card to see how it will look
 * and to provide ReportContext for stories that need to utilize
 */
export const ReportCardDecorator = (storyFn) => (
  // @ts-ignore
  <ReportContext.Provider value={genSampleSketchContext()}>
    <ReportWindow storyFn={() => <Card>{storyFn()}</Card>} />
  </ReportContext.Provider>
);
export default ReportCardDecorator;

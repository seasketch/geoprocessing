import React from "react";
import Card from "./Card";
import { ReportWindow } from "./ReportDecorator";
import ReportContext from "../ReportContext";
import { genSampleSketchContext } from "../helpers";

/**
 * ReportDecorator that wraps the story in a Card to see how it will look
 * and to provide ReportContext for stories that need to utilize
 */
export default (storyFn) => (
  // @ts-ignore
  <ReportContext.Provider value={genSampleSketchContext()}>
    <ReportWindow storyFn={() => <Card>{storyFn()}</Card>} />
  </ReportContext.Provider>
);

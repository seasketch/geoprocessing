import React from "react";
import Card from "./Card";
import { ReportWindow } from "./ReportDecorator";

/**
 * ReportDecorator that additionally wraps the story in a Card
 */
export default (storyFn) => (
  // @ts-ignore
  <ReportWindow storyFn={() => <Card>{storyFn()}</Card>} />
);

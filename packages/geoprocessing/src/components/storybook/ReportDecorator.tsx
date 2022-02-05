import React from "react";
import { StoryLayout } from "./StoryLayout";

/**
 * Default decorator.  Create additional building on StoryLayout for more sophisticated needs
 */
export const ReportDecorator = (storyFn): JSX.Element => {
  return <StoryLayout>{storyFn()}</StoryLayout>;
};
export default ReportDecorator;

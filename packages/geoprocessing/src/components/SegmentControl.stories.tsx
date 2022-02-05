import React from "react";
import { SegmentControl } from "./SegmentControl";
import ReportDecorator from "./storybook/ReportDecorator";

export default {
  component: SegmentControl,
  title: "Components/SegmentControl",
  decorators: [ReportDecorator],
};

export const tabOne = () => (
  <SegmentControl
    value={"One"}
    onClick={(segment) => console.log("clicked " + segment)}
    segments={["One", "Two", "Three"]}
  />
);

export const tabTwo = () => (
  <SegmentControl
    value={"Two"}
    onClick={(segment) => console.log("clicked " + segment)}
    segments={["One", "Two", "Three"]}
  />
);

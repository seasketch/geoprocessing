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
    value={"one"}
    onClick={(segment) => console.log("clicked " + segment)}
    segments={[
      { id: "one", label: "One" },
      { id: "two", label: "Two" },
      { id: "three", label: "Three" },
    ]}
  />
);

export const tabTwo = () => (
  <SegmentControl
    value={"two"}
    onClick={(segment) => console.log("clicked " + segment)}
    segments={[
      { id: "one", label: "One" },
      { id: "two", label: "Two" },
      { id: "three", label: "Three" },
    ]}
  />
);

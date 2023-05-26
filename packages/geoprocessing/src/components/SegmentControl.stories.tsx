import React from "react";
import { SegmentControl } from "./SegmentControl";
import { createReportDecorator } from "./storybook/ReportDecorator";
import Translator from "./i18n/TranslatorAsync";

export const tabOne = () => (
  <Translator>
    <SegmentControl
      value={"one"}
      onClick={(segment) => console.log("clicked " + segment)}
      segments={[
        { id: "one", label: "One" },
        { id: "two", label: "Two" },
        { id: "three", label: "Three" },
      ]}
    />
  </Translator>
);

export const tabTwo = () => (
  <Translator>
    <SegmentControl
      value={"two"}
      onClick={(segment) => console.log("clicked " + segment)}
      segments={[
        { id: "one", label: "One" },
        { id: "two", label: "Two" },
        { id: "three", label: "Three" },
      ]}
    />
  </Translator>
);

export default {
  component: SegmentControl,
  title: "Components/SegmentControl",
  decorators: [createReportDecorator()],
};

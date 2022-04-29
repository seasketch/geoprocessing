import React from "react";
import { VerticalSpacer } from "./VerticalSpacer";
import { CardDecorator, ReportDecorator } from "./storybook";

export default {
  component: VerticalSpacer,
  title: "Components/VerticalSpacer",
  decorators: [CardDecorator, ReportDecorator],
};

export const simple = () => (
  <>
    <div>1rem spacer below</div>
    <VerticalSpacer />
    <div>2rem spacer below</div>
    <VerticalSpacer height="2rem" />
    <div>bottom</div>
  </>
);

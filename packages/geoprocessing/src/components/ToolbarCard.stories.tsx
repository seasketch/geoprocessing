import React from "react";
import ToolbarCard from "./ToolbarCard";
import ReportDecorator from "./storybook/ReportDecorator";
import { SimpleButton } from "./buttons";

export default {
  component: ToolbarCard,
  title: "Components/Card/ToolbarCard",
  decorators: [ReportDecorator],
};

export const titleOnly = () => (
  <ToolbarCard leftItems="ToolbarCard Title">
    <p>Body text goes here.</p>
  </ToolbarCard>
);

const rightItems = (
  <div>
    <SimpleButton>⬇</SimpleButton>
    <SimpleButton>➥</SimpleButton>
  </div>
);

export const buttons = () => (
  <ToolbarCard leftItems="Card with Tools" rightItems={rightItems}>
    <p>Body text goes here.</p>
  </ToolbarCard>
);

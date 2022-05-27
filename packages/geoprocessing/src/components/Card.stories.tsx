import React from "react";
import Card from "./Card";
import ReportDecorator from "./storybook/ReportDecorator";

export default {
  component: Card,
  title: "Components/Card/Card",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card title="Card Title">
    <p>Body text goes here.</p>
  </Card>
);

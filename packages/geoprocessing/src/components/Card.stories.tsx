import React from "react";
import Card from "./Card.js";
import ReportDecorator from "./storybook/ReportDecorator.js";

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

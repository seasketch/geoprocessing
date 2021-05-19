import React from "react";
import Card from "./Card";
import SimpleButton from "./buttons/SimpleButton";
import ReportDecorator from "./ReportDecorator";

export default {
  component: Card,
  title: "Components/Card",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card title="Card Title">
    <p>Body text goes here.</p>
  </Card>
);

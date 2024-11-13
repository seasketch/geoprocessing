import React from "react";
import { Collapse } from "../components/Collapse.js";
import { Card } from "./Card.js";
import { ReportDecorator } from "./storybook/ReportDecorator.jsx";

export default {
  component: Collapse,
  title: "Components/Collapse",
  decorators: [ReportDecorator],
};

export const collapse = () => (
  <Card title="Card Title">
    <Collapse title="Learn more">Help text here</Collapse>
  </Card>
);

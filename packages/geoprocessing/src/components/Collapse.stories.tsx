import React from "react";
import { Collapse } from "../components/Collapse.js";
import { ReportDecorator, Card } from "./index.js";

export default {
  component: Collapse,
  title: "Components/Collapse",
  decorators: [ReportDecorator],
};

export const text = () => (
  <Card title="Card Title">
    <Collapse title="Learn more">Help text here</Collapse>
  </Card>
);

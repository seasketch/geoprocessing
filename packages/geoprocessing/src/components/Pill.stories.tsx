import React from "react";
import Card from "./Card.js";
import { Pill, GroupPill, GreenPill, WarningPill } from "./Pill.js";
import ReportDecorator from "./storybook/ReportDecorator.js";

export default {
  component: Pill,
  title: "Components/Pill",
  decorators: [ReportDecorator],
};

const groupColorMap = {
  high: "#BEE4BE",
  med: "#FFE1A3",
  low: "#F7A6B4",
};

export const pill = () => (
  <Card title="Report Title">
    <p>Basic</p>
    <p>
      <Pill>Default</Pill>
      <Pill color="#FFE1A3">Yellow</Pill>
      <Pill color="#BEE4BE">Green</Pill>
    </p>
    <p>Helper Pills</p>
    <p>
      <WarningPill>WarningPill</WarningPill>
      <GreenPill>GreenPill</GreenPill>
    </p>
    <p>GroupPill with color map:</p>
    <p>
      <GroupPill groupColorMap={groupColorMap} group="high">
        High
      </GroupPill>
      <GroupPill groupColorMap={groupColorMap} group="med">
        Medium
      </GroupPill>
      <GroupPill groupColorMap={groupColorMap} group="low">
        Low
      </GroupPill>
    </p>
  </Card>
);

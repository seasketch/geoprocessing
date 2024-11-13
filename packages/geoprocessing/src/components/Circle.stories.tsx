import React from "react";
import Card from "./Card.js";
import { Circle, GroupCircle } from "./Circle.js";
import ReportDecorator from "./storybook/ReportDecorator.js";

export default {
  component: Circle,
  title: "Components/Circle",
  decorators: [ReportDecorator],
};

const groupColorMap = {
  high: "#BEE4BE",
  med: "#FFE1A3",
  low: "#F7A6B4",
};

export const circle = () => (
  <Card>
    <div>
      <Circle>S</Circle>
      <Circle color="#FFE1A3" size={30}>
        M
      </Circle>
      <Circle color="#BEE4BE" size={40}>
        L
      </Circle>
    </div>

    <p>GroupCircle with color map:</p>
    <p>
      <GroupCircle groupColorMap={groupColorMap} group="high">
        H
      </GroupCircle>
      <GroupCircle groupColorMap={groupColorMap} group="med">
        M
      </GroupCircle>
      <GroupCircle groupColorMap={groupColorMap} group="low">
        L
      </GroupCircle>
    </p>
  </Card>
);

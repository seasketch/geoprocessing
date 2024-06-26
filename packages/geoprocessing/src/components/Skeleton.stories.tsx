import React from "react";
import Card from "./Card.js";
import { Skeleton } from "./Skeleton.js";
import ReportDecorator from "./storybook/ReportDecorator.js";

export default {
  component: Skeleton,
  title: "Components/Skeleton",
  decorators: [ReportDecorator],
};

export const small = () => (
  <Card>
    <Skeleton />
  </Card>
);

export const larger = () => (
  <Card>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </Card>
);

export const custom = () => (
  <Card>
    <div>
      <Skeleton style={{ width: "100%", height: "130px" }} />
      <Skeleton />
      <Skeleton />
      <Skeleton style={{ width: "50%" }} />
    </div>
  </Card>
);

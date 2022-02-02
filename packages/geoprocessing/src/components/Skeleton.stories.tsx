import React from "react";
import Card from "./Card";
import { Skeleton } from "./Skeleton";
import ReportDecorator from "./ReportDecorator";

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

import React from "react";
import { IucnMatrix } from "./IucnMatrix";
import { Card, ReportDecorator } from "..";

export default {
  component: IucnMatrix,
  title: "Components/Iucn/IucnMatrix",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card>
    <IucnMatrix />
  </Card>
);

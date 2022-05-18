import React from "react";
import { IucnMatrix } from "./IucnMatrix";
import { Card } from "../Card";
import { ReportDecorator } from "../storybook/ReportDecorator";

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

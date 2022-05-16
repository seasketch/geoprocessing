import React from "react";
import { IucnDesignationTable } from "./IucnDesignationTable";
import { Card } from "../Card";
import { ReportDecorator } from "../storybook/ReportDecorator";

export default {
  component: IucnDesignationTable,
  title: "Components/Iucn/IucnDesignationTable",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card>
    <IucnDesignationTable />
  </Card>
);

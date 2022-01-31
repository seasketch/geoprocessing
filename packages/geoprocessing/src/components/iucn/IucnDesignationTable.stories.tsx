import React from "react";
import { IucnDesignationTable } from "./IucnDesignationTable";
import { Card, ReportDecorator } from "..";

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

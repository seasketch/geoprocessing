import React from "react";
import Card from "./Card";
import { ObjectiveStatus } from "./ObjectiveStatus";
import ReportDecorator from "./storybook/ReportDecorator";

export default {
  component: ObjectiveStatus,
  title: "Components/ObjectiveStatus",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card title="Report Title">
    <ObjectiveStatus
      status="yes"
      msg={
        <>
          This MPA meets the objective of protecting <b>20%</b>
          of key habitat
        </>
      }
    />
  </Card>
);

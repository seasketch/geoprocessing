import React from "react";
import { ObjectiveStatus } from "./ObjectiveStatus";
import { ReportDecorator, CardDecorator } from "./storybook";

export default {
  component: ObjectiveStatus,
  title: "Components/ObjectiveStatus",
  decorators: [ReportDecorator],
};

export const yes = () => (
  <ObjectiveStatus
    status="yes"
    msg={
      <>
        This MPA meets the objective of protecting <b>20%</b>
        of key habitat
      </>
    }
  />
);

export const no = () => (
  <ObjectiveStatus
    status="no"
    msg={
      <>
        This MPA meets the objective of protecting <b>20%</b>
        of key habitat
      </>
    }
  />
);

export const maybe = () => (
  <ObjectiveStatus
    status="maybe"
    msg={
      <>
        This MPA meets the objective of protecting <b>20%</b>
        of key habitat
      </>
    }
  />
);

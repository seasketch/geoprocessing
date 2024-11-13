import React from "react";
import { ObjectiveStatus } from "./ObjectiveStatus.js";
import { ReportDecorator, CardDecorator } from "./storybook/index.js";

export default {
  component: ObjectiveStatus,
  title: "Components/ObjectiveStatus",
  decorators: [CardDecorator, ReportDecorator],
};

export const yes = () => (
  <ObjectiveStatus
    status="yes"
    msg={
      <>
        This MPA meets the objective of protecting <b>20%</b> of key habitat
      </>
    }
  />
);

export const no = () => (
  <ObjectiveStatus
    status="no"
    msg={
      <>
        This MPA does not meet the objective of protecting <b>20%</b> of key
        habitat
      </>
    }
  />
);

export const maybe = () => (
  <ObjectiveStatus
    status="maybe"
    msg={
      <>
        This MPA may meet the objective of protecting <b>20%</b> of key habitat
      </>
    }
  />
);

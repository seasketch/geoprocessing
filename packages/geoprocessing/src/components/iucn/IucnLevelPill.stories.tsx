import React from "react";
import Card from "../Card.js";
import { IucnLevelPill } from "./IucnLevelPill.js";
import ReportDecorator from "../storybook/ReportDecorator.js";

export default {
  component: IucnLevelPill,
  title: "Components/Iucn/IucnLevelPill",
  decorators: [ReportDecorator],
};

export const pill = () => (
  <Card title="Report Title">
    <p>
      <IucnLevelPill level="full">Full</IucnLevelPill> +{" "}
      <IucnLevelPill level="high">High</IucnLevelPill> +{" "}
      <IucnLevelPill level="low">Low</IucnLevelPill>
    </p>
  </Card>
);

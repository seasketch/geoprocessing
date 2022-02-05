import React from "react";
import { IucnLevelCircle } from "./IucnLevelCircle";
import ReportDecorator from "../storybook/ReportDecorator";
import { Card } from "../Card";

export default {
  component: IucnLevelCircle,
  title: "Components/Iucn/IucnLevelCircle",
  decorators: [ReportDecorator],
};

export const circle = () => (
  <Card>
    <p>
      <IucnLevelCircle level="full">F</IucnLevelCircle>
      <IucnLevelCircle level="high">H</IucnLevelCircle>
      <IucnLevelCircle level="low">L</IucnLevelCircle>
      <IucnLevelCircle level="full">3</IucnLevelCircle>
      <IucnLevelCircle level="high">45</IucnLevelCircle>
      <IucnLevelCircle level="low">12</IucnLevelCircle>
    </p>
  </Card>
);

import React from "react";
import { ReportError } from "./ReportError.js";
import ReportDecorator from "./storybook/ReportDecorator.js";
import Card from "./Card.js";

export default {
  component: ReportError,
  title: "Components/ReportError",
  decorators: [ReportDecorator],
};

const ThrowComponent = () => {
  throw Error("error!");
  return <></>;
};

export const throws = () => (
  <ReportError>
    <ThrowComponent />
  </ReportError>
);

export const okay = () => (
  <ReportError>
    <Card>
      <p>This message should display without error</p>
    </Card>
  </ReportError>
);

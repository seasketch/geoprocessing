import React from "react";
import Card from "./Card.js";
import { ErrorStatus } from "./ErrorStatus.js";
import ReportDecorator from "./storybook/ReportDecorator.js";

export default {
  component: ErrorStatus,
  title: "Components/ErrorStatus",
  decorators: [ReportDecorator],
};

export const errorStatus = () => (
  <Card>
    <ErrorStatus
      size={32}
      msg={<>Your sketch falls outside of project boundaries</>}
    />
  </Card>
);

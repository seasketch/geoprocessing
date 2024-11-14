import React from "react";
import Card from "./Card.js";
import ReportDecorator from "./storybook/ReportDecorator.js";
import { InfoStatus } from "./InfoStatus.js";

export default {
  component: InfoStatus,
  title: "Components/InfoStatus",
  decorators: [ReportDecorator],
};

export const infoStatus = () => (
  <Card>
    <InfoStatus
      msg={
        <>
          These are <b>draft</b> reports. Please report any issues.
        </>
      }
    />
  </Card>
);

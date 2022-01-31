import React from "react";
import Card from "./Card";
import { InfoStatus } from "./InfoStatus";
import ReportDecorator from "./ReportDecorator";

export default {
  component: InfoStatus,
  title: "Components/InfoStatus",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card title="Report Title">
    <InfoStatus
      size={32}
      msg={
        <span>
          These are <b>draft</b> reports. Please report any issues.
        </span>
      }
    />
  </Card>
);

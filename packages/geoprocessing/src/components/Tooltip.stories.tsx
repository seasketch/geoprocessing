import React from "react";
import Card from "./Card.js";
import { Tooltip } from "./Tooltip.js";
import ReportDecorator from "./storybook/ReportDecorator.js";
import { InfoCircleFill } from "@styled-icons/bootstrap";

export default {
  component: Tooltip,
  title: "Components/Tooltip",
  decorators: [ReportDecorator],
};

export const tooltip = () => (
  <Card title="Report Title">
    <p>
      Tooltip over text:{" "}
      <Tooltip text="This is a tooltip">
        <span>Hover</span>
      </Tooltip>
    </p>
    <p>
      Tooltip over icon:{" "}
      <Tooltip text="This is a tooltip">
        <InfoCircleFill
          size={14}
          style={{
            color: "#83C6E6",
          }}
        />
      </Tooltip>
    </p>
    <p>
      Tooltip with specific width:{" "}
      <Tooltip text="This is a tooltip" width={50}>
        <InfoCircleFill
          size={14}
          style={{
            color: "#83C6E6",
          }}
        />
      </Tooltip>
    </p>
    <p>
      Tooltip with top-start placement and 10px offset:{" "}
      <Tooltip
        text="This is a tooltip"
        placement="top-start"
        offset={{ horizontal: 10, vertical: 10 }}
      >
        <InfoCircleFill
          size={14}
          style={{
            color: "#83C6E6",
          }}
        />
      </Tooltip>
    </p>
  </Card>
);

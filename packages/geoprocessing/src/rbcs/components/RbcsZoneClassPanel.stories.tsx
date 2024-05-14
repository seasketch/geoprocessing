import React from "react";
import { ReportDecorator, CardDecorator } from "../../components/storybook/index.js";
import { RbcsZoneClassPanel } from "./RbcsZoneClassPanel.js";

export default {
  component: RbcsZoneClassPanel,
  title: "Components/Rbcs/RbcsZoneClassPanel",
  decorators: [CardDecorator, ReportDecorator],
};

export const simple = () => (
  <>
    <>
      {Array.from({ length: 8 }, (v, i) => (
        <RbcsZoneClassPanel value={i + 1} />
      ))}
    </>
  </>
);

import React from "react";
import { ReportDecorator, CardDecorator } from "../../components/storybook";
import { RbcsZoneClassPanel } from "./RbcsZoneClassPanel";

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

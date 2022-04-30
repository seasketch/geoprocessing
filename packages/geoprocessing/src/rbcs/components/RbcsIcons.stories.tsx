import React from "react";
import { ReportDecorator, CardDecorator } from "../../components/storybook";
import { RbcsIcon, RbcsZoneRegIcon } from "./RbcsIcons";

export default {
  component: RbcsIcon,
  title: "Components/Rbcs/RbcsIcon",
  decorators: [CardDecorator, ReportDecorator],
};

export const zone = () => (
  <>
    <RbcsZoneRegIcon value={1} />
    <RbcsZoneRegIcon value={2} />
    <RbcsZoneRegIcon value={3} />
    <RbcsZoneRegIcon value={4} />
    <RbcsZoneRegIcon value={5} />
    <RbcsZoneRegIcon value={6} />
    <RbcsZoneRegIcon value={7} />
    <RbcsZoneRegIcon value={8} />
  </>
);

export const mpa = () => (
  <>
    <RbcsIcon value={0} />
    <RbcsIcon value={1.5} />
    <RbcsIcon value={3.5} />
    <RbcsIcon value={5} />
    <RbcsIcon value={6.5} />
    <RbcsIcon value={8.5} />
  </>
);

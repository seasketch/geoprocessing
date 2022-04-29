import React from "react";
import { ReportDecorator, CardDecorator } from "../../components/storybook";
import { RbcsIcon, ZoneRegIcon } from "./RbcsIcons";

export default {
  component: RbcsIcon,
  title: "Components/Rbcs/RbcsIcon",
  decorators: [CardDecorator, ReportDecorator],
};

export const zone = () => (
  <>
    <ZoneRegIcon value={1} />
    <ZoneRegIcon value={2} />
    <ZoneRegIcon value={3} />
    <ZoneRegIcon value={4} />
    <ZoneRegIcon value={5} />
    <ZoneRegIcon value={6} />
    <ZoneRegIcon value={7} />
    <ZoneRegIcon value={8} />
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

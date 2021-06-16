import React from "react";
import SketchAttributesCard from "./SketchAttributesCard";
import ReportCardDecorator from "./ReportCardDecorator";

export default {
  component: SketchAttributesCard,
  title: "Components/SketchAttributesCard",
  decorators: [ReportCardDecorator],
};

export const simple = () => <SketchAttributesCard title="Attributes" />;

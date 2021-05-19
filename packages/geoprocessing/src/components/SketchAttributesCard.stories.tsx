import React from "react";
import SketchAttributesCard from "./SketchAttributesCard";
import ReportCardDecorator from "./ReportCardDecorator";
import ReportContext from "../ReportContext";
import { GeoprocessingProject } from "../types";
import { genSampleSketchContext } from "../fixtures/sketch";

export default {
  component: SketchAttributesCard,
  title: "Components/SketchAttributesCard",
  decorators: [ReportCardDecorator],
};

export const simple = () => <SketchAttributesCard title="Attributes" />;

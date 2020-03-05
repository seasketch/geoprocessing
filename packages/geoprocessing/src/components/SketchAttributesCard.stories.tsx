import React from "react";
import SketchAttributesCard from "./SketchAttributesCard";
import ReportDecorator from "./ReportDecorator";
import ReportContext from "../ReportContext";
import { GeoprocessingProject } from "../types";

export default {
  component: SketchAttributesCard,
  title: "Components|SketchAttributesCard",
  decorators: [ReportDecorator]
};

export const simple = () => (
  <ReportContext.Provider
    value={{
      sketchProperties: {
        name: "My Sketch",
        id: "abc123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sketchClassId: "efg345",
        userAttributes: [
          {
            exportId: "DESIGNATION",
            fieldType: "ChoiceField",
            label: "Designation",
            value: "Marine Reserve"
          },
          {
            exportId: "COMMENTS",
            fieldType: "TextArea",
            label: "Comments",
            value: "This is my MPA and it is going to be the greatest. Amazing."
          }
        ]
      },
      geometryUri: "",
      projectUrl: "https://example.com/project"
    }}
  >
    <SketchAttributesCard title="Attributes" />
  </ReportContext.Provider>
);

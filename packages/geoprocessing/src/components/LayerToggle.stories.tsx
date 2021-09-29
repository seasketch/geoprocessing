import React from "react";
import LayerToggle from "./LayerToggle";
import ReportDecorator from "./ReportDecorator";
import ReportContext from "../ReportContext";

export default {
  component: LayerToggle,
  title: "Components/LayerToggle",
  decorators: [ReportDecorator],
};

export const unchecked = () => (
  <ReportContext.Provider
    value={{
      sketchProperties: {
        name: "My Sketch",
        id: "abc123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sketchClassId: "efg345",
        isCollection: false,
        userAttributes: [
          {
            exportId: "DESIGNATION",
            fieldType: "ChoiceField",
            label: "Designation",
            value: "Marine Reserve",
          },
          {
            exportId: "COMMENTS",
            fieldType: "TextArea",
            label: "Comments",
            value:
              "This is my MPA and it is going to be the greatest. Amazing.",
          },
        ],
      },
      geometryUri: "",
      projectUrl: "https://example.com/project",
      visibleLayers: [],
    }}
  >
    <LayerToggle layerId={"5e80c8a8cd44abca6e5268af"} label="Show Map Layer" />
  </ReportContext.Provider>
);

export const checked = () => (
  <ReportContext.Provider
    value={{
      sketchProperties: {
        name: "My Sketch",
        id: "abc123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sketchClassId: "efg345",
        isCollection: false,
        userAttributes: [
          {
            exportId: "DESIGNATION",
            fieldType: "ChoiceField",
            label: "Designation",
            value: "Marine Reserve",
          },
          {
            exportId: "COMMENTS",
            fieldType: "TextArea",
            label: "Comments",
            value:
              "This is my MPA and it is going to be the greatest. Amazing.",
          },
        ],
      },
      geometryUri: "",
      projectUrl: "https://example.com/project",
      visibleLayers: ["5e80c8a8cd44abca6e5268af"],
    }}
  >
    <LayerToggle layerId={"5e80c8a8cd44abca6e5268af"} label="Show Map Layer" />
  </ReportContext.Provider>
);

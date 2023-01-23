import React from "react";
import SketchAttributesCard from "./SketchAttributesCard";
import ReportDecorator from "./storybook/ReportDecorator";
import { ReportContext } from "../context";

export default {
  component: SketchAttributesCard,
  title: "Components/SketchAttributesCard",
  decorators: [ReportDecorator],
};

const mappings = {
  ACTIVITIES: {
    WORKS: "Works",
    UNTREATED_WATER: "Untreated Water",
    HABITATION: "Habitation",
  },
  ROMAN: {
    I: "One",
    II: "Two",
  },
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
          {
            label: "Allowed Activities no mapping",
            fieldType: "ChoiceField",
            exportId: "ACTIVITIEZ",
            value: '["WORKS","UNTREATED_WATER","HABITATION"]',
          },
          {
            label: "Allowed Activities with mapping",
            fieldType: "ChoiceField",
            exportId: "ACTIVITIES",
            value: '["WORKS","UNTREATED_WATER","HABITATION"]',
          },
          {
            label: "Allowed Activities JSON string with mapping",
            fieldType: "ChoiceField",
            exportId: "ACTIVITIES",
            value: ["WORKS", "UNTREATED_WATER", "HABITATION"],
          },
          {
            exportId: "ROMAN",
            fieldType: "ChoiceField",
            label: "Roman number",
            value: "II",
          },
          {
            label: "Include this?",
            value: false,
            exportId: "BOOLEAN",
            fieldType: "YesNo",
          },
          {
            label: "Include this other thing?",
            value: true,
            exportId: "BOOLEANTWO",
            fieldType: "YesNo",
          },
        ],
      },
      geometryUri: "",
      projectUrl: "https://example.com/project",
      visibleLayers: [],
    }}
  >
    <SketchAttributesCard title="Attributes" mappings={mappings} />
  </ReportContext.Provider>
);

import React from "react";
import SketchAttributesCard from "./SketchAttributesCard";
import ReportDecorator from "./storybook/ReportDecorator";
import { createReportStoryLayout } from "./storybook";
import { ReportContext, sampleSketchReportContextValue } from "../context";
import Translator from "./i18n/TranslatorAsync";

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

const contextValue = sampleSketchReportContextValue({
  sketchProperties: {
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
        value: "This is my MPA and it is going to be the greatest. Amazing.",
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
        exportId: "ACTIVITIES_JSON_STRING",
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
});

export const simple = () => (
  <Translator>
    <SketchAttributesCard title="Attributes" mappings={mappings} />
  </Translator>
);

export default {
  component: SketchAttributesCard,
  title: "Components/SketchAttributesCard",
  decorators: [createReportStoryLayout(contextValue)],
};

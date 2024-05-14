import React from "react";
import SketchAttributesCard from "./SketchAttributesCard.js";
import { sampleSketchReportContextValue } from "../context/index.js";
import Translator from "./i18n/TranslatorAsync.js";
import ReportDecorator from "./storybook/ReportDecorator.js";
import { ReportContext } from "../context/ReportContext.js";

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

const legacyContextValue = sampleSketchReportContextValue({
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
      {
        label: "Empty field",
        value: null,
        exportId: "Foo",
        fieldType: "TextArea",
      },
    ],
  },
});

export const legacy = () => (
  <ReportContext.Provider value={legacyContextValue}>
    <Translator>
      <SketchAttributesCard title="Attributes Legacy" mappings={mappings} />
    </Translator>
  </ReportContext.Provider>
);

export default {
  component: SketchAttributesCard,
  title: "Components/Card/SketchAttributesCard",
  decorators: [ReportDecorator],
};

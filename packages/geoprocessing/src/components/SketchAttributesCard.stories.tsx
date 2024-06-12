import React from "react";
import SketchAttributesCard from "./SketchAttributesCard.js";
import { createReportDecorator } from "./storybook/index.js";
import { sampleSketchReportContextValue } from "../context/index.js";
import Translator from "./i18n/TranslatorAsync.js";

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
    ],
  },
});

const nextContextValue = sampleSketchReportContextValue({
  sketchProperties: {
    userAttributes: [
      {
        label: "Designation",
        value: "FULLY_PROTECTED",
        exportId: "designation",
        fieldType: "ComboBox",
        valueLabel: "Fully Protected",
        formElementId: 2987,
        alternateLanguages: {
          pt: {
            label: "Designação",
            valueLabel: "Totalmente Protegido",
          },
        },
      },
      {
        label: "Island",
        value: ["FLORES"],
        exportId: "island",
        fieldType: "MultipleChoice",
        valueLabel: ["Flores"],
        formElementId: 2990,
        alternateLanguages: {
          pt: {
            label: "Ilha",
            valueLabel: ["Floresita"],
          },
        },
      },
    ],
  },
});

export default {
  component: SketchAttributesCard,
  title: "Components/Card/SketchAttributesCard",
  decorators: [createReportDecorator(nextContextValue)],
};

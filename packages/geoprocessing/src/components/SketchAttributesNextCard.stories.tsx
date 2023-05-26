import React from "react";
import SketchAttributesCard from "./SketchAttributesCard";
import { createReportDecorator } from "./storybook";
import { sampleSketchReportContextValue } from "../context";
import Translator from "./i18n/TranslatorAsync";

const nextContextValue = sampleSketchReportContextValue({
  sketchProperties: {
    userAttributes: [
      {
        label: "Author(s)",
        value: null,
        exportId: "authors",
        fieldType: "TextArea",
        valueLabel: null,
        formElementId: 2630,
        alternateLanguages: {},
      },
      {
        label: "Description",
        value: "Test description",
        exportId: "descriptionconsider_adding_a_ra",
        fieldType: "TextArea",
        valueLabel: null,
        formElementId: 2629,
        alternateLanguages: {},
      },
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

export const next = () => (
  <Translator>
    <SketchAttributesCard title="Attributes Next" />
  </Translator>
);

export default {
  component: SketchAttributesCard,
  title: "Components/Card/SketchAttributesCard",
  decorators: [createReportDecorator(nextContextValue)],
};

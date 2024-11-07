import React from "react";
import SketchAttributesCard from "./SketchAttributesCard.js";
import { createReportDecorator } from "./storybook/index.js";
import { sampleSketchReportContextValue } from "../context/index.js";
import Translator from "./i18n/TranslatorAsync.js";

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
        label: "Comments with no value",
        value: null,
        exportId: "comments",
        fieldType: "TextArea",
        valueLabel: null,
        formElementId: 4757,
        alternateLanguages: {
          pt: {
            label: "Comentários",
            valueLabel: null,
          },
        },
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
      {
        label: "Gears",
        value: ["LONG_LINE", "TRAWL"],
        exportId: "gears",
        fieldType: "MultipleChoice",
        valueLabel: ["Long Line", "Trawl"],
        formElementId: 2300,
        alternateLanguages: {
          pt: {
            label: "Engrenagens",
            valueLabel: ["Linha Longa", "Arrasto"],
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

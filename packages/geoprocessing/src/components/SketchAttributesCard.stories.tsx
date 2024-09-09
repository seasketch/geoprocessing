import SketchAttributesCard from "./SketchAttributesCard.js";
import { createReportDecorator } from "./storybook/index.js";
import { sampleSketchReportContextValue } from "../context/index.js";

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

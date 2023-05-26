import React from "react";
import { SizeCard } from "./SizeCard";
import {
  createReportDecorator,
  sampleSketchReportContextValue,
} from "@seasketch/geoprocessing/client-ui";
import Translator from "../components/TranslatorAsync";

const contextValue = sampleSketchReportContextValue({
  visibleLayers: [],
  exampleOutputs: [
    {
      functionName: "calculateArea",
      sketchName: "My Sketch",
      results: {
        area: 19384872,
      },
    },
  ],
});

// Wrap in Translator to allow translations to work in storybook without report client
export const basic = () => (
  <Translator>
    <SizeCard />
  </Translator>
);

export default {
  component: SizeCard,
  title: "Project/Components/SizeCard",
  decorators: [createReportDecorator(contextValue)],
};

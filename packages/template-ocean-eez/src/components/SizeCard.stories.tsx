import React from "react";
import SizeCard from "./SizeCard";
import {
  createReportStoryLayout,
  sampleSketchReportContextValue,
} from "@seasketch/geoprocessing/client-ui";
import Translator from "./TranslatorAsync";

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

export const basic = () => (
  <Translator>
    <SizeCard />
  </Translator>
);

export default {
  component: SizeCard,
  title: "Project/Components/SizeCard",
  decorators: [createReportStoryLayout(contextValue)],
};

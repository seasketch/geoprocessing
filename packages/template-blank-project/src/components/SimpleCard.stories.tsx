import React from "react";
import { SimpleCard } from "./SimpleCard.js";
import {
  createReportDecorator,
  sampleSketchReportContextValue,
} from "@seasketch/geoprocessing/client-ui";
import Translator from "../components/TranslatorAsync.js";

const contextValue = sampleSketchReportContextValue({
  visibleLayers: [],
  exampleOutputs: [
    {
      functionName: "simpleFunction",
      sketchName: "My Sketch",
      results: {
        area: 92607364669.43335,
        nearbyEcoregions: ["Marshall Islands", "East Caroline Islands"],
        minTemp: 28.011158,
        maxTemp: 30.495605,
      },
    },
  ],
});

// Wrap in Translator to allow translations to work in storybook without report client
export const basic = () => (
  <Translator>
    <SimpleCard />
  </Translator>
);

export default {
  component: SimpleCard,
  title: "Project/Components/SimpleCard",
  decorators: [createReportDecorator(contextValue)],
};

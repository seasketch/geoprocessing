import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { SimpleCard } from "../components/SimpleCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";

// Named export loaded by storybook
export const SimpleReport = () => {
  return (
    <Translator>
      <SimpleCard />
      <SketchAttributesCard autoHide />
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default SimpleReport;

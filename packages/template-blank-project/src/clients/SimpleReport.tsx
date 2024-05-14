import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { SimpleCard } from "../components/SimpleCard.js";

// Named export loaded by storybook
export const SimpleReport = () => {
  return (
    <Translator>
      <SimpleCard />
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default SimpleReport;

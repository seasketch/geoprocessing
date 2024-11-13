import React, { useState } from "react";
import { Geography } from "../types/index.js";
import { GeographySwitcher } from "./GeographySwitcher.js";
import Translator from "./i18n/TranslatorAsync.js";
import { createReportDecorator } from "./storybook/ReportDecorator.js";

export default {
  component: GeographySwitcher,
  title: "Components/GeographySwitcher",
  decorators: [createReportDecorator()],
};

const testGeogs: Geography[] = [
  {
    geographyId: "geography1",
    datasourceId: "ds1",
    display: "Geography 1",
    precalc: true,
  },
  {
    geographyId: "geography2",
    datasourceId: "ds2",
    display: "Geography 2",
    precalc: true,
  },
];

// Wrap in Translator to allow translations to work in storybook without report client
export const geographySwitcher = () => {
  const [curGeographyId, setCurGeographyId] = useState("test2");

  return (
    <Translator>
      <GeographySwitcher
        geographies={testGeogs}
        curGeographyId={curGeographyId}
        changeGeography={(e) => {
          console.log(`You selected ${e.target.value}`);
          setCurGeographyId(e.target.value);
        }}
      />
    </Translator>
  );
};

import React from "react";
import { Geography } from "../types";
import { GeographySwitcher } from "./GeographySwitcher";
import Translator from "./i18n/TranslatorAsync";
import { createReportDecorator } from "./storybook/ReportDecorator";

export default {
  component: GeographySwitcher,
  title: "Components/GeographySwitcher",
  decorators: [createReportDecorator()],
};

const testGeogs: Geography[] = [
  {
    geographyId: "test1",
    datasourceId: "ds1",
    display: "Geography 1",
    precalc: true,
  },
  {
    geographyId: "test2",
    datasourceId: "ds2",
    display: "Geography 2",
    precalc: true,
  },
];

// Wrap in Translator to allow translations to work in storybook without report client
export const basic = () => (
  <Translator>
    <GeographySwitcher
      geographies={testGeogs}
      changeGeography={(e) => {
        console.log(`You clicked ${e.target.value}`);
      }}
      curGeographyId="test2"
    />
  </Translator>
);

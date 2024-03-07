import React from "react";
import Card from "../Card.js";
import { LanguageSwitcher } from "./LanguageSwitcher.js";
import ReportDecorator from "../storybook/ReportDecorator.js";
import { ReportContext, sampleSketchReportContextValue } from "../../context/index.js";

export default {
  component: LanguageSwitcher,
  title: "Components/LanguageSwitcher",
  decorators: [ReportDecorator],
};

const sampleContextValue = sampleSketchReportContextValue();

const ptContextValue = {
  ...sampleContextValue,
  language: "pt",
};

export const simple = () => (
  <ReportContext.Provider value={sampleContextValue}>
    <Card>
      <LanguageSwitcher />
    </Card>
  </ReportContext.Provider>
);

export const portugeuese = () => (
  <ReportContext.Provider value={ptContextValue}>
    <Card>
      <LanguageSwitcher></LanguageSwitcher>
    </Card>
  </ReportContext.Provider>
);

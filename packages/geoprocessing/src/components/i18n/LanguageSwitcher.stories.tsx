import React from "react";
import Card from "../Card";
import { LanguageSwitcher } from "./LanguageSwitcher";
import ReportDecorator from "../storybook/ReportDecorator";
import { ReportContext, sampleSketchReportContextValue } from "../../context";

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

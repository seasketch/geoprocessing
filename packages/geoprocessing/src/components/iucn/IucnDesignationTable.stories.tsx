import React from "react";
import { IucnDesignationTable } from "./IucnDesignationTable";
import { Card } from "../Card";
import { ReportDecorator } from "../storybook/ReportDecorator";
import Translator from "../i18n/TranslatorAsync";

export default {
  component: IucnDesignationTable,
  title: "Components/Iucn/IucnDesignationTable",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Translator>
    <Card>
      <IucnDesignationTable />
    </Card>
  </Translator>
);

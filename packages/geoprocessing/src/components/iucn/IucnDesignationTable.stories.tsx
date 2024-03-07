import React from "react";
import { IucnDesignationTable } from "./IucnDesignationTable.js";
import { Card } from "../Card.js";
import { ReportDecorator } from "../storybook/ReportDecorator.js";
import Translator from "../i18n/TranslatorAsync.js";

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

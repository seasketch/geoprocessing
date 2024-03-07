import React from "react";
import { IucnMatrix } from "./IucnMatrix.js";
import { Card } from "../Card.js";
import { ReportDecorator } from "../storybook/ReportDecorator.js";
import Translator from "../i18n/TranslatorAsync.js";

export default {
  component: IucnMatrix,
  title: "Components/Iucn/IucnMatrix",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Translator>
    <Card>
      <IucnMatrix />
    </Card>
  </Translator>
);

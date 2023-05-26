import React from "react";
import { IucnMatrix } from "./IucnMatrix";
import { Card } from "../Card";
import { ReportDecorator } from "../storybook/ReportDecorator";
import Translator from "../i18n/TranslatorAsync";

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

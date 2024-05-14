import React from "react";
import { WatersDiagram } from "./WatersDiagram.js";
import Translator from "../i18n/TranslatorAsync.js";
import { ReportDecorator } from "../storybook/index.js";
import Card from "../Card.js";

export default {
  component: WatersDiagram,
  title: "Components/WatersDiagram",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card>
    <Translator>
      <WatersDiagram />
    </Translator>
  </Card>
);

export const updateLabel = () => (
  <Card>
    <Translator>
      <WatersDiagram
        labels={[
          {
            key: "nearshore",
            labelText: "Nearshore\n(0-6 nautical miles)",
            style: {
              font: "12pt Helvetica, Arial, sans-serif",
              whiteSpace: "pre",
            },
          },
          { key: "offshore", labelText: "Offshore\n(6-200 nautical miles)" },
          { key: "eez", y: 250 },
          {
            key: "eez",
            style: {
              font: "10pt Helvetica, Arial, sans-serif",
            },
          },
        ]}
      />
    </Translator>
  </Card>
);

export const removeLabel = () => (
  <Card>
    <Translator>
      <WatersDiagram labels={[{ key: "land", labelText: "" }]} />
    </Translator>
  </Card>
);

export const addLabel = () => (
  <Card>
    <Translator>
      <WatersDiagram
        labels={[
          {
            key: "internationWaters",
            labelText: "International Waters",
            x: 200,
            y: 50,
          },
        ]}
      />
    </Translator>
  </Card>
);

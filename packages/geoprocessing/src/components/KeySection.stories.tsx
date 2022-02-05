import React from "react";
import Card from "./Card";
import { KeySection } from "./KeySection";
import ReportDecorator from "./storybook/ReportDecorator";

export default {
  component: KeySection,
  title: "Components/KeySection",
  decorators: [ReportDecorator],
};

export const simple = () => (
  <Card title="Card Title">
    <KeySection>
      <p>KeySection is inside the card and stands out.</p>
    </KeySection>
  </Card>
);

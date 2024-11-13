import React from "react";
import Card from "./Card.js";
import { KeySection } from "./KeySection.js";
import ReportDecorator from "./storybook/ReportDecorator.js";

export default {
  component: KeySection,
  title: "Components/KeySection",
  decorators: [ReportDecorator],
};

export const keySection = () => (
  <Card title="Card Title">
    <KeySection>
      <p>KeySection is inside the card and stands out.</p>
    </KeySection>
  </Card>
);

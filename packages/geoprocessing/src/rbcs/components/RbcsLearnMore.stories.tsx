import React from "react";
import { RbcsLearnMore } from "./RbcsLearnMore";
import { ReportDecorator, CardDecorator } from "../../components/storybook";
import { RbcsObjective } from "../types";

export default {
  component: RbcsLearnMore,
  title: "Components/Rbcs/RbcsLearnMore",
  decorators: [CardDecorator, ReportDecorator],
};

const objectives: Record<string, RbcsObjective> = {
  eez: {
    id: "eez",
    shortDesc: "30% of EEZ protected",
    target: 0.3,
    countsToward: {
      "Fully Protected Area": "yes",
      "Highly Protected Area": "yes",
      "Moderately Protected Area": "no",
      "Poorly Protected Area": "no",
      "Unprotected Area": "no",
    },
  },
  eezNoTake: {
    id: "eezNoTake",
    shortDesc: "15% of EEZ no-take protection",
    target: 0.15,
    countsToward: {
      "Fully Protected Area": "yes",
      "Highly Protected Area": "no",
      "Moderately Protected Area": "no",
      "Poorly Protected Area": "no",
      "Unprotected Area": "no",
    },
  },
};

export const simple = () => <RbcsLearnMore objectives={objectives} />;

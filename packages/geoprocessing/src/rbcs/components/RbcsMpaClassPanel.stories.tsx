import React from "react";
import { ReportDecorator, CardDecorator } from "../../components/storybook/index.js";
import { RbcsMpaClassPanel } from "./RbcsMpaClassPanel.js";
import { getMpaClassificationName } from "../helpers.js";

export default {
  component: RbcsMpaClassPanel,
  title: "Components/Rbcs/RbcsMpaClassPanel",
  decorators: [CardDecorator, ReportDecorator],
};

const values = [1.25, 2.35, 3.65, 4.15, 5.85, 6.35, 7.15];

export const simple = () => (
  <>
    {values.map((value) => (
      <>
        <p>If MPA has index value: {value}</p>
        <RbcsMpaClassPanel
          value={value}
          displayName={getMpaClassificationName(value)}
        />
      </>
    ))}
  </>
);

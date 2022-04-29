import React from "react";
import { HorizontalStackedBar, RowConfig } from "./HorizontalStackedBar";
import { ReportDecorator, CardDecorator } from "../storybook/";
import { VerticalSpacer } from "../VerticalSpacer";
import { valueFormatter } from "../../helpers/valueFormatter";

export default {
  component: HorizontalStackedBar,
  title: "Components/HorizontalStackedBar",
  decorators: [CardDecorator, ReportDecorator],
};

const rows1 = [
  [
    [2, 10],
    [5, 13, 4],
  ],
];

const rows2 = [[[12]]];

const rows3 = [
  [
    [2, 10],
    [5, 13, 4],
  ],
  [
    [2, 12, 5],
    [15, 17],
  ],
];

const rowConfigs1: RowConfig[] = [
  {
    title: "Network 1",
  },
];
const rowConfigs2: RowConfig[] = [
  {
    title: "Network 2",
  },
];
const rowConfigs3: RowConfig[] = [
  {
    title: "Network 2",
  },
  {
    title: "Network 3",
  },
];

const blockGroupNames = ["Fully Protected Area", "Highly Protected Area"];
const blockGroupStyles = [
  { backgroundColor: "#64c2a6" },
  { backgroundColor: "#aadea7" },
  { backgroundColor: "gray" },
];

export const singleBar = () => (
  <>
    <HorizontalStackedBar
      rows={rows1}
      max={100}
      target={30}
      rowConfigs={rowConfigs1}
      blockGroupNames={blockGroupNames}
      blockGroupStyles={blockGroupStyles}
    />
    <VerticalSpacer />
    <HorizontalStackedBar
      rows={rows2}
      max={100}
      target={15}
      rowConfigs={rowConfigs2}
      blockGroupNames={blockGroupNames}
      blockGroupStyles={blockGroupStyles}
    />
  </>
);

export const multipleBar = () => (
  <>
    <HorizontalStackedBar
      rows={rows3}
      max={100}
      target={30}
      rowConfigs={rowConfigs3}
      blockGroupNames={blockGroupNames}
      blockGroupStyles={blockGroupStyles}
    />
  </>
);

export const targetValueFormatter = () => (
  <>
    <HorizontalStackedBar
      rows={rows1}
      max={100}
      target={30}
      rowConfigs={rowConfigs1}
      blockGroupNames={blockGroupNames}
      blockGroupStyles={blockGroupStyles}
      targetValueFormatter={(value) =>
        `Target - ${valueFormatter(30 / 100, "percent0dig")}`
      }
    />
  </>
);

export const targetOnBottom = () => (
  <>
    <HorizontalStackedBar
      rows={rows1}
      max={100}
      target={30}
      rowConfigs={rowConfigs1}
      blockGroupNames={blockGroupNames}
      blockGroupStyles={blockGroupStyles}
      targetLabelPosition={"bottom"}
    />
  </>
);

import React from "react";
import { PointyCircle, TwoColorPointyCircle } from "./PointyCircle";
import { ReportDecorator, CardDecorator } from "../../components/storybook";

export default {
  component: PointyCircle,
  title: "Components/Rbcs/PointyCircle",
  decorators: [CardDecorator, ReportDecorator],
};

export const simple = () => (
  <>
    <PointyCircle>5</PointyCircle>
    <PointyCircle color="red">R</PointyCircle>
    <PointyCircle color="blue">B</PointyCircle>
  </>
);

export const twoColor = () => (
  <>
    <TwoColorPointyCircle perc={0}>0</TwoColorPointyCircle>
    <TwoColorPointyCircle perc={50}>50</TwoColorPointyCircle>
    <TwoColorPointyCircle perc={100}>100</TwoColorPointyCircle>
    <TwoColorPointyCircle topColor="red" bottomColor="blue" perc={20}>
      20
    </TwoColorPointyCircle>
    <TwoColorPointyCircle topColor="red" bottomColor="blue" perc={60}>
      60
    </TwoColorPointyCircle>
  </>
);

import React from "react";
import DataDownload from "./DataDownload.js";
import fixtures from "../testing/fixtures/index.js";
import { SimpleButton } from "./SimpleButton.js";
import ReportDecorator from "./storybook/ReportDecorator.js";

export default {
  component: DataDownload,
  title: "Components/DataDownload",
  decorators: [ReportDecorator],
};

export const simple = () => {
  return (
    <>
      <DataDownload
        filename="sample"
        data={fixtures.ranked}
        formats={["csv", "json"]}
      />
    </>
  );
};

export const flattenNested = () => {
  return (
    <>
      <DataDownload filename="sample" data={fixtures.nested} />
    </>
  );
};

export const button = () => {
  return (
    <>
      <DataDownload
        filename="sample"
        data={fixtures.ranked}
        formats={["csv", "json"]}
        titleElement={<SimpleButton>➥ Export</SimpleButton>}
      />
    </>
  );
};

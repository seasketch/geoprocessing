import React from "react";
import DataDownload from "./DataDownload";
import fixtures from "../fixtures";

export default {
  component: DataDownload,
  title: "Components|DataDownload",
  decorators: [],
};

export const simple = () => {
  return (
    <>
      <DataDownload filename="sample" data={fixtures.ranked as any} />
    </>
  );
};

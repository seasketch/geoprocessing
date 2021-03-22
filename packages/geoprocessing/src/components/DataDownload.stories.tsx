import React from "react";
import DataDownload from "./DataDownload";

export default {
  component: DataDownload,
  title: "Components|DataDownload",
  decorators: [],
};

export const simple = () => {
  return (
    <>
      <DataDownload
        filename="sample"
        data={[
          ["header1", "header2"],
          ["row1", 6],
          ["row2", 18],
        ]}
      />
    </>
  );
};

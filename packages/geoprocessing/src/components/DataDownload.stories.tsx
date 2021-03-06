import React from "react";
import DataDownload from "./DataDownload";

export default {
  component: DataDownload,
  title: "Components",
  decorators: [],
};

export const dataDownload = () => {
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

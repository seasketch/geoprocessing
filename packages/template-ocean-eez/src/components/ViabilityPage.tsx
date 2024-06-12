import React from "react";
import { SizeCard } from "./SizeCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";

const ReportPage = () => {
  return (
    <>
      <SizeCard />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ReportPage;

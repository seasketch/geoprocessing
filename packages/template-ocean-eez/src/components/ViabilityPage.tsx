import React from "react";
import SizeCard from "./SizeCard";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";

const ReportPage = () => {
  return (
    <>
      <SketchAttributesCard autoHide />
      <SizeCard />
    </>
  );
};

export default ReportPage;

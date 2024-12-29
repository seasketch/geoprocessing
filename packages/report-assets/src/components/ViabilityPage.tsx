import React from "react";
import { SizeCard } from "./SizeCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";

const ViabilityPage = () => {
  return (
    <>
      <SizeCard />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ViabilityPage;

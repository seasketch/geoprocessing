import React from "react";
import { SimpleCard } from "./SimpleCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";

export const ViabilityPage = () => {
  return (
    <>
      <SimpleCard />
      <SketchAttributesCard autoHide />
    </>
  );
};

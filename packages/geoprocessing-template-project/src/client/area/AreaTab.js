import React from "react";
import { Card } from "@seasketch/geoprocessing-client";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const AreaTab = ({ serviceResults, sketch, api }) => {
  const area = serviceResults["area"].areaKm;
  return (
    <>
      <Card title="Zone Size">
        📐 This feature is <b>{Number.format(Math.round(area))}</b> square
        kilometers.
      </Card>
    </>
  );
};

export default AreaTab;

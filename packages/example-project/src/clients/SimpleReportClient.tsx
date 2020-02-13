import React from "react";
import {
  ResultsCard,
  SketchAttributesCard
} from "@seasketch/geoprocessing/client";
import { AreaResults as Results } from "../functions/area";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const SimpleReportClient = () => {
  return (
    <>
      <SketchAttributesCard />
      <ResultsCard title="Zone Size" functionName="area">
        {(data:Results) => (
          <p>
            📐This feature is <b>{
              Number.format(Math.round(data.area * 1e-6))
            }</b> square kilometers.
          </p>
        )}
      </ResultsCard>
    </>
  );
};

export default SimpleReportClient;

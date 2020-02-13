import React from "react";
import {
  ResultsCard,
  SketchAttributesCard
} from "@seasketch/geoprocessing/client";
import { AreaResults } from "../functions/area";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const SimpleReportClient = () => {
  return (
    <>
      <SketchAttributesCard />
      <ResultsCard title="Zone Size" functionName="area">
        {(data: AreaResults) => (
          <p>
            📐This feature is <b>{Number.format(Math.round(data.area * 1e-6))}</b> square kilometers.
          </p>
        )}
      </ResultsCard>
    </>
  );
};

export default SimpleReportClient;

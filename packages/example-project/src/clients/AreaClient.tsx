import React from "react";
import {
  ResultsCard,
  SketchAttributesCard,
  Skeleton,
} from "@seasketch/geoprocessing/client";
// Import the results type definition from your functions to type-check your
// component render functions
import { AreaResults } from "../functions/area";
import { AsyncAreaResults } from "../functions/areaAsync";
import TasksModel from "@seasketch/geoprocessing/src/tasks";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const AreaClient = () => {
  return (
    <>
      <SketchAttributesCard autoHide={true} />
      <ResultsCard title="Zone Size" functionName="area">
        {(data: AreaResults) => (
          <p>
            📐This feature is{" "}
            <b>{Number.format(Math.round(data.area * 1e-6))}</b> square
            kilometers.
          </p>
        )}
      </ResultsCard>
      <ResultsCard title="Async Zone Size with Async" functionName="areaAsync">
        {(dataAsync: AsyncAreaResults) => (
          <p>
            📐This feature is{" "}
            <b>{Number.format(Math.round(dataAsync?.area * 1e-6))}</b> square
            kilometers.
          </p>
        )}
      </ResultsCard>
    </>
  );
};

export default AreaClient;

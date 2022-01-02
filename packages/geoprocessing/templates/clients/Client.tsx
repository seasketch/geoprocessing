import React from "react";
import {
  ResultsCard,
  SketchAttributesCard,
  Skeleton,
} from "@seasketch/geoprocessing/client-ui";
// Import the results type definition from your functions to type-check your
// component render functions
import { AreaResults } from "../functions/area";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const Client = () => {
  return (
    <>
      <SketchAttributesCard autoHide={true} />
      <ResultsCard
        title="Zone Size"
        functionName="area"
        skeleton={<LoadingSkeleton />}
      >
        {(data: AreaResults) => (
          <p>
            📐This feature is{" "}
            <b>{Number.format(Math.round(data.area * 1e-6))}</b> square
            kilometers.
          </p>
        )}
      </ResultsCard>
    </>
  );
};

const LoadingSkeleton = () => (
  <p>
    <Skeleton style={{}}>&nbsp;</Skeleton>
  </p>
);

export default Client;

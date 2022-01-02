import React from "react";
import {
  ResultsCard,
  SketchAttributesCard,
  Skeleton,
} from "@seasketch/geoprocessing/client-ui";
import { RasterSumResults } from "../functions/rasterSum";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const RasterStats = () => {
  return (
    <>
      <SketchAttributesCard autoHide={true} />
      <ResultsCard title="Raster Sum Overlaps" functionName="rasterSum">
        {(rasterData: RasterSumResults) => (
          <p>
            📐This feature overlaps with{" "}
            <b>{Number.format(Math.round(rasterData?.area))}</b> somethings from
            the raster
          </p>
        )}
      </ResultsCard>
    </>
  );
};

export default RasterStats;

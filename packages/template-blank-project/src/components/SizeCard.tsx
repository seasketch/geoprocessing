import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard, Skeleton } from "@seasketch/geoprocessing/client-ui";
// Import the results type definition from your functions to type-check your
// component render functions
import { AreaResults } from "../functions/area";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const SizeCard = () => {
  const { t } = useTranslation("gp");
  return (
    <>
      <ResultsCard
        title={t("SizeCardTitle", "Zone Size")}
        functionName="calculateArea"
        skeleton={<LoadingSkeleton />}
      >
        {(data: AreaResults) => (
          <p>
            📐
            <Trans ns="gp" i18nKey="SizeCardAreaMsg">
              This sketch is{" "}
              <b>{{ area: Number.format(Math.round(data.area * 1e-6)) }}</b>{" "}
              square kilometers
            </Trans>
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

export default SizeCard;

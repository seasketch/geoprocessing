import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
// Import the results type definition from your functions to type-check your
// component render functions
import { SimpleResults } from "../functions/simpleFunction";
import Translator from "../components/TranslatorAsync";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

/**
 * SimpleCard component
 */
export const SimpleCard = () => {
  const { t } = useTranslation();
  return (
    <>
      <ResultsCard
        title={t("SimpleCard title", "Zone Report")}
        functionName="simpleFunction"
      >
        {(data: SimpleResults) => {
          return (
            <>
              <p>
                📐
                <Trans i18nKey="SimpleCard sketch size message">
                  This sketch is{" "}
                  <b>{{ area: Number.format(Math.round(data.area * 1e-6)) }}</b>{" "}
                  square kilometers
                </Trans>
              </p>
              <p>
                <Trans i18nKey="SimpleCard ecoregion message">
                  The following ecoregions are nearby:{" "}
                  <b>{data.nearbyEcoregions.join(", ")}</b>
                </Trans>
              </p>
              <p>
                <Trans i18nKey="SimpleCard temperature message">
                  The present day sea surface temperature within this sketch is{" "}
                  <b>
                    {{ minTemp: roundDecimal(data.minTemp, 1) }} -{" "}
                    {{ maxTemp: roundDecimal(data.maxTemp, 1) }}
                    &deg;C
                  </b>
                  .
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

/**
 * SimpleCard as a top-level report client
 */
export const SimpleCardReportClient = () => {
  return (
    <Translator>
      <SimpleCard />
    </Translator>
  );
};

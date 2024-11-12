import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
// Import the results type definition from your functions to type-check and
// access the result in your component render function
import { SimpleResults } from "../functions/simpleFunction.js";
import Translator from "../components/TranslatorAsync.js";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

/**
 * SimpleCard component
 */
export const SimpleCard = () => {
  const { t } = useTranslation();
  const titleTrans = t("SimpleCard title", "Simple Report");
  return (
    <>
      <ResultsCard title={titleTrans} functionName="simpleFunction">
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

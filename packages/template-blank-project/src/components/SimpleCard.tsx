import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ResultsCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
// Import SimpleResults to type-check data access in ResultsCard render function
import { SimpleResults } from "../functions/simpleFunction.js";
import Translator from "../components/TranslatorAsync.js";
import { roundDecimalFormat } from "@seasketch/geoprocessing/client-core";

const SimpleCard = () => {
  const { t } = useTranslation();
  const [{ isCollection }] = useSketchProperties();
  const titleTrans = t("SimpleCard title", "Simple Report");
  return (
    <>
      <ResultsCard title={titleTrans} functionName="simpleFunction">
        {(data: SimpleResults) => {
          return (
            <>
              <p>
                <Trans
                  i18nKey="SimpleCard sketch size message"
                  values={{
                    collection: isCollection ? " collection" : "",
                    area: roundDecimalFormat(data.area, 0),
                  }}
                  components={{ 1: <b /> }}
                >
                  {`This sketch{{collection}} is <1>{{area}}</1> square kilometers.`}
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

// Default export lazy-loaded by top-level ReportApp
export const TranslatedSimpleCard = () => {
  return (
    <Translator>
      <SimpleCard />
    </Translator>
  );
};

export default TranslatedSimpleCard;

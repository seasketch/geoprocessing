import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ResultsCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
// Import SimpleResults to type-check data access in ResultsCard render function
import { SimpleResults } from "../functions/simpleFunction.js";
import { roundDecimalFormat } from "@seasketch/geoprocessing/client-core";

export const SimpleCard = () => {
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
                    sketchOrCollection: isCollection
                      ? t("sketch collection")
                      : t("sketch"),
                    /** Area converted to square kilometers, rounded and formatted, with very small numbers maintained */
                    area: roundDecimalFormat(data.area / 1_000_000, 0, {
                      keepSmallValues: true,
                    }),
                  }}
                  components={{ 1: <b /> }}
                >
                  {`This {{sketchOrCollection}} is <1>{{area}}</1> square kilometers.`}
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

// The use of values and components avoids a type issue with react-i18next - https://github.com/i18next/react-i18next/issues/1483#issuecomment-1206720504
// The <1></1> component is a placeholder used to create a translatable string when there is a variable value, the bold tag gets swapped in at runtime

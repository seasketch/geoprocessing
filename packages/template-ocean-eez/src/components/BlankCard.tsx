import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ReportError,
  ResultsCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { GeogProp, ReportResult } from "@seasketch/geoprocessing/client-core";

/**
 * BlankCard component
 */
export const BlankCard: React.FunctionComponent<GeogProp> = (props) => {
  const { t } = useTranslation();
  const [{ isCollection }] = useSketchProperties();

  return (
    <ResultsCard title={t("BlankCard")} functionName="blankFunction">
      {(data: ReportResult) => {
        const sketchStr = isCollection ? t("sketch collection") : t("sketch");
        const dataStr = JSON.stringify(data);

        return (
          <ReportError>
            <p>
              <Trans i18nKey="BlankCard Sketch Message">
                This is a blank {{ sketchStr }} with result {{ dataStr }}.
              </Trans>
            </p>
          </ReportError>
        );
      }}
    </ResultsCard>
  );
};

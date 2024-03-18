import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ReportError,
  ResultsCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { GeogProp, ReportResult } from "@seasketch/geoprocessing/client-core";
import project from "../../project";

/**
 * BlankCard component
 */
export const BlankCard: React.FunctionComponent<GeogProp> = (props) => {
  const { t } = useTranslation();
  const [{ isCollection }] = useSketchProperties();
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });

  return (
    <ResultsCard title={t("BlankCard")} functionName="blankFunction">
      {(data: ReportResult) => {
        return (
          <ReportError>
            <p>
              <Trans i18nKey="BlankCard Message">This is a blank report.</Trans>
            </p>
          </ReportError>
        );
      }}
    </ResultsCard>
  );
};

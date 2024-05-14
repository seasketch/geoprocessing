import React, { useState } from "react";
import { SegmentControl, ReportPage } from "@seasketch/geoprocessing/client-ui";
import ViabilityPage from "../components/ViabilityPage.js";
import RepresentationPage from "../components/RepresentationPage.js";
import { useTranslation } from "react-i18next";
import { Translator } from "../components/TranslatorAsync.js";

const enableAllTabs = false;

const BaseReport = () => {
  const { t } = useTranslation();
  const viabilityId = "viability";
  const representationId = "representation";
  const segments = [
    { id: viabilityId, label: t("Viability") },
    { id: representationId, label: t("Representation") },
  ];
  const [tab, setTab] = useState<string>(viabilityId);
  return (
    <>
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={segments}
        />
      </div>
      <ReportPage hidden={!enableAllTabs && tab !== viabilityId}>
        <ViabilityPage />
      </ReportPage>
      <ReportPage hidden={!enableAllTabs && tab !== representationId}>
        <RepresentationPage />
      </ReportPage>
    </>
  );
};

// Named export loaded by storybook
export const MpaTabReport = () => {
  // Translator must be in parent FunctionComponent in order for ReportClient to use useTranslate hook
  return (
    <Translator>
      <BaseReport />
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default MpaTabReport;

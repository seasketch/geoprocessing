import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SegmentControl, ReportPage } from "@seasketch/geoprocessing/client-ui";
import { ViabilityPage } from "../components/ViabilityPage.js";
import Translator from "../components/TranslatorAsync.js";

const enableAllTabs = false;
const BaseReport = () => {
  const { t } = useTranslation();
  const viabilityId = "viability";
  const segments = [{ id: viabilityId, label: t("Viability") }];
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
    </>
  );
};

// Named export loaded by storybook
export const TabReport = () => {
  return (
    <Translator>
      <BaseReport />
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default TabReport;

import React, { useState } from "react";
import { SegmentControl, ReportPage } from "@seasketch/geoprocessing/client-ui";
import ViabilityPage from "../components/ViabilityPage";
import { useTranslation } from "react-i18next";
import Translator from "../components/Translator";

const enableAllTabs = false;
const TabReportClient = () => {
  const { t } = useTranslation("gp");
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

export default function () {
  // Translator must be in parent FunctionComponent in order for ReportClient to use useTranslate hook
  return (
    <Translator>
      <TabReportClient />
    </Translator>
  );
}

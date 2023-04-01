import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SegmentControl, ReportPage } from "@seasketch/geoprocessing/client-ui";
import { ViabilityPage } from "../components/ViabilityPage";
import Translator from "../components/TranslatorAsync";

const enableAllTabs = false;
const TabReport = () => {
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

export default function () {
  // Translator must be in parent FunctionComponent to have access to useTranslate hook
  return (
    <Translator>
      <TabReport />
    </Translator>
  );
}

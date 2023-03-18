import React, { useState } from "react";
import { ReportPage } from "./ReportPage";
import ReportDecorator from "./storybook/ReportDecorator";
import { SegmentControl } from "./SegmentControl";

export default {
  component: ReportPage,
  title: "Components/ReportPage",
  decorators: [ReportDecorator],
};

export const simple = () => {
  const [tab, setTab] = useState<string>("Page 1");
  const enableAllTabs = false;
  return (
    <>
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={[
            { id: "page1", label: "Page 1" },
            { id: "page2", label: "Page 2" },
          ]}
        />
      </div>
      <ReportPage hidden={!enableAllTabs && tab !== "Page 1"}>
        <div>One</div>
      </ReportPage>
      <ReportPage hidden={!enableAllTabs && tab !== "Page 2"}>
        <div>Two</div>
      </ReportPage>
    </>
  );
};

import React, { useState } from "react";
import { ReportPage } from "./ReportPage.js";
import ReportDecorator from "./storybook/ReportDecorator.js";
import { SegmentControl } from "./SegmentControl.js";
import Card from "./Card.js";

export default {
  component: ReportPage,
  title: "Components/ReportPage",
  decorators: [ReportDecorator],
};

export const reportPage = () => {
  const [tab, setTab] = useState<string>("page1");
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
      <ReportPage hidden={!enableAllTabs && tab !== "page1"}>
        <Card>Report page 1</Card>
      </ReportPage>
      <ReportPage hidden={!enableAllTabs && tab !== "page2"}>
        <Card>Report page 2</Card>
      </ReportPage>
    </>
  );
};

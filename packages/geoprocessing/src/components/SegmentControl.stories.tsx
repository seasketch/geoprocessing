import React, { useState } from "react";
import { SegmentControl } from "./SegmentControl.js";
import { createReportDecorator } from "./storybook/ReportDecorator.js";
import Translator from "./i18n/TranslatorAsync.js";
import { ReportPage } from "./ReportPage.js";
import Card from "./Card.js";
import Skeleton from "./Skeleton.js";

export const segmentControl = () => {
  const [tab, setTab] = useState<string>("one");
  return (
    <Translator>
      <SegmentControl
        value={tab}
        onClick={(segment) => setTab(segment)}
        segments={[
          { id: "one", label: "One" },
          { id: "two", label: "Two" },
          { id: "three", label: "Three" },
        ]}
      />
      <ReportPage hidden={tab !== "one"}>
        <Card>
          <Skeleton />
          <Skeleton />
        </Card>
      </ReportPage>
      <ReportPage hidden={tab !== "two"}>
        <Card>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Card>
      </ReportPage>
      <ReportPage hidden={tab !== "three"}>
        <Card>
          <Skeleton />
        </Card>
      </ReportPage>
    </Translator>
  );
};

export default {
  component: SegmentControl,
  title: "Components/SegmentControl",
  decorators: [createReportDecorator()],
};

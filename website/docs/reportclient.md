# Report Client

Report clients are React UI components that can be registered with SeaSketch and when given a sketch URL as input, are able to run one or more geoprocessing functions, and display their results in a meaningful way.

When you `init` a new project, it will create your first report client(s) for you in `src/clients`. The examples below are based on initializing a `blank project`.

## Base Report

The first step in creating a report client is to create the outer container. Here is the SimpleReport.tsx file generated with a blank project.

```typescript
import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { SimpleCard } from "../components/SimpleCard.js";

// Named export loaded by storybook
export const SimpleReport = () => {
  return (
    <Translator>
      <SimpleCard />
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default SimpleReport;
```

A more typical report client has one or more hideable [ReportPage](./api/client-ui/functions/ReportPage.md) components controlled by a [SegmentControl](./api/client-ui/functions/SegmentControl.md) with clickable tabs allowing the user to switch between pages.

The following is the TabReport.tsx file generated when you `init` your first project.

```typescript
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
```

Notice that:

- BaseReport enables translations for all user-facing English string by wrapping them in `t()` function calls.See the [internationalization](./gip/GIP-1-i18n.md) docs for more info.
- A BaseReport component is then created that is wrapped in a `Translator` component to create the final `TabReport`. The Translator is responsible for loading translations and tracking language change events.
- A `ViabilityPage` component is rendered inside the ReportPage. This is the heart of creating custom reports (covered in the next section).

## Custom Report Sections

ResultsCard

[The `create:report` CLI command is available for

## Registering Report Client

BlankReport.tsx will already be registered in `project/geoprocessing.json`.

Each geoprocessing function must be registered in `project/geoprocessing.json`, in order for it to be published by the project manifest and made discoverable by the SeaSketch platform.

##

It's possible to invoke a geoprocessing function using the [useFunction](./) hook.

## Edge Cases

### Zero Geography - No Overlap With MetricGroup (NaN)

This use case happens when no features for some class of data within a datasource, overlap with a geography. This produces a zero (0) value metric in precalc. If this zero value metric gets passed as the denominator to `toPercentMetric(numeratorMetrics, denominatorMetrics)`, the function will return a `NaN` value, rather than 0. This is so that downstream consumers can understand this isn't just any 0. There's an opportunity to tell the user that no matter where they put their sketch within the geography, there is no way for the value to be more than zero. For example, the ClassTable component looks for `NaN` metric values and will automatically display 0%, along with an informative popover explaining that no data class features are within the current geography.

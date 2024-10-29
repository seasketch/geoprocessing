# Report Client

Report clients are React UI components that can be registered with SeaSketch and when given a user-drawn Sketch, they run one or more geoprocessing functions against that Sketch, and display the result in a way that is meaningful to the project.

As a report developer you don't need to think about how a report client is bundled and published, you just need to focus on producing useful results and displaying in a way that is easy to understand.

What the geoprocessing framework is taking care of for you is bundling all of your projects report clients into a single React web application, then publishing it for a SeaSketch admin to register with one or more sketch classes. Then when a SeaSketch user clicks a user-drawn Sketch and chooses to "View attributes and reports", it loads your published report app in its sidebar (using an iframe).

## Where To Start

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

The following is the `src/clients/TabReport.tsx` file generated when you `init` your first project. And it imports and uses multiple report pages generated into the `src/components` directory.

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

- The top-level TabReport client is just a container, filled with a hierarchy of React components, each playing their own role.
- TabReport is wrapped first in a `Translator` component, responsible for loading translations and making them available to the components within it and tracking language change events to swap in different sets of translated strings.
- BaseReport then contains one or more ReportPage components and a SegmentControl to allow the user to switch between the pages and show only one at a time.
- All of these components wrap their user-facing English strings using the `t()` function. See the [internationalization](./gip/GIP-1-i18n.md) docs for more info.
- A single `ViabilityPage` component is rendered inside the ReportPage component. It controls the layout and rendering of one or more custom report sections. You can add even more pages to your report as needed.

## Custom Report Sections

The word `Card` is user interface design terminology for a section of a page that looks like a rectangular card. As a report developer, when you create your own report pages, you are typically designing cards that build on a base ResultsCard component.

A ResultsCard invokes the geoprocessing function of your choosing and passes any extra parameters you choose (see Geography Switcher section below for example), and then renders the results of the function in whatever way you choose. There is a library of [UI building blocks](/storybook) you can integrate, many of which are built on the concept of MetricGroups and Metrics.

Here is the SimpleCard.tsx installed when you initialize a new basic project.

```typescript
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
// Import the results type definition from your functions to type-check and
// access the result in your component render function
import { SimpleResults } from "../functions/simpleFunction.js";
import Translator from "../components/TranslatorAsync.js";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

/**
 * SimpleCard component
 */
export const SimpleCard = () => {
  const { t } = useTranslation();
  const titleTrans = t("SimpleCard title", "Zone Report");
  return (
    <>
      <ResultsCard title={titleTrans} functionName="simpleFunction">
        {(data: SimpleResults) => {
          return (
            <>
              <p>
                📐
                <Trans i18nKey="SimpleCard sketch size message">
                  This sketch is{" "}
                  <b>{{ area: Number.format(Math.round(data.area * 1e-6)) }}</b>{" "}
                  square kilometers
                </Trans>
              </p>
              <p>
                <Trans i18nKey="SimpleCard ecoregion message">
                  The following ecoregions are nearby:{" "}
                  <b>{data.nearbyEcoregions.join(", ")}</b>
                </Trans>
              </p>
              <p>
                <Trans i18nKey="SimpleCard temperature message">
                  The present day sea surface temperature within this sketch is{" "}
                  <b>
                    {{ minTemp: roundDecimal(data.minTemp, 1) }} -{" "}
                    {{ maxTemp: roundDecimal(data.maxTemp, 1) }}
                    &deg;C
                  </b>
                  .
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

/**
 * SimpleCard as a top-level report client
 */
export const SimpleCardReportClient = () => {
  return (
    <Translator>
      <SimpleCard />
    </Translator>
  );
};
```

Notice that:

- The ResultsCard component contains within it a render function that receives the results of running the geoprocessing function (a published AWS Lambda function) defined by `functionName`. So calling the function and rendering the results are all self-contained in one ResultsCard implementation.
- All UI components that are used are imported from [@seasketch/geoprocessing/client-ui](./api/client-ui/index.md) and all utility functions are imported from [@seasketch/geoprocessing/client-core](./api/client-core/index.md). Your reports should never import directly from the top-level [@seasketch/geoprocessing](./api/geoprocessing/index.md) module! The reason is that while some functions you need may be available for import via the top-level module, that module also contains code that is specific to the NodeJS environment used by geoprocessing functions, so even if it works in your storybook environment, it will often cause errors or size bloat when you later bundle your report using the `build` command. Stick to importing from `client-ui` and `client-core` for browser use.
- Translation is built-in and all user-facing English strings are wrapped in translation functions using either `t()` via the `useTranslation` hook or the `Trans` component. See the [react-i18next][https://react.i18next.com/] documentation to learn more.

To get ideas for building your reports you can look at different [SeaSketch projects](https://www.seasketch.org/projects) (ask for access to draw sketches and run reports where needed) and you can also [search across](https://github.com/search?q=org%3Aseasketch%20%3CResultsCard&type=code) the code for all geoprocessing project repositories in Github for the use of the phrase `<ResultsCard` for example, or any other phrase of your choosing.

## Registering Report Clients

Whether you `init` a new project or use the `create:client` and `create:report` commands, a report client will be created and registered already in `project/geoprocessing.json` for you, along with all of the additional components it needs in `src/components`.

If you create your own report client in `src/clients`, then you will need to register it in `project/geoprocessing.json` manually.

Once registered, the next time your project is deployed, your report client will be discoverable by the SeaSketch platform.

## Create Client / Function / Report

`create:client`
`create:function`
`create:report`

## Utility Functions

Component that is only rendered if the sketch is a collection

```typescript
const [{ isCollection }] = useSketchProperties();

{isCollection && (
  <Collapse title={t("Show by MPA")}>
    {genSketchTable(data, metricGroup, precalcMetrics)}
  </Collapse>
)}
```

Slice and dice metrics into form expected by Table components ([link](https://github.com/seasketch/bermuda-reports-next/blob/8734c04457a1499a932339d73464f472726c4a9a/src/components/OusGear.tsx))

```typescript
  return (
    <ResultsCard
      title={titleLabel}
      functionName="ousGear"
      extraParams={{ geographyIds: [curGeography.geographyId] }}
    >
      {(data: ReportResult) => {
        const percMetricIdName = `${metricGroup.metricId}Perc`;

        const valueMetrics = metricsWithSketchId(
          data.metrics.filter((m) => m.metricId === metricGroup.metricId),
          [data.sketch.properties.id],
        );
        const percentMetrics = toPercentMetric(valueMetrics, precalcMetrics, {
          metricIdOverride: percMetricIdName,
        });
        const metrics = [...valueMetrics, ...percentMetrics];

...

const genSketchTable = (
  data: ReportResult,
  metricGroup: MetricGroup,
  precalcMetrics: Metric[],
) => {
  // Build agg metric objects for each child sketch in collection with percValue for each class
  const childSketches = toNullSketchArray(data.sketch);
  const childSketchIds = childSketches.map((sk) => sk.properties.id);
  const childSketchMetrics = toPercentMetric(
    metricsWithSketchId(
      data.metrics.filter((m) => m.metricId === metricGroup.metricId),
      childSketchIds,
    ),
    precalcMetrics,
  );
  const sketchRows = flattenBySketchAllClass(
    childSketchMetrics,
    metricGroup.classes,
    childSketches,
  );
  return (
    <SketchClassTable rows={sketchRows} metricGroup={metricGroup} formatPerc />
  );
};
```

## Advacned Report Components

Examples of reports using all of these

## Edge Cases

### Zero Geography - No Overlap With MetricGroup (NaN)

This use case happens when no features for some class of data within a datasource, overlap with a geography. This produces a zero (0) value metric in precalc. If this zero value metric gets passed as the denominator to `toPercentMetric(numeratorMetrics, denominatorMetrics)`, the function will return a `NaN` value, rather than 0. This is so that downstream consumers can understand this isn't just any 0. There's an opportunity to tell the user that no matter where they put their sketch within the geography, there is no way for the value to be more than zero. For example, the ClassTable component looks for `NaN` metric values and will automatically display 0%, along with an informative popover explaining that no data class features are within the current geography.

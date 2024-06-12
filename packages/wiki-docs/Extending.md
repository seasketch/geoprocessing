It is possible to extend the geoprocessing framework to meet your needs right in your project code space. Here are some common use cases.

# I need to do additional data preparation before `data:import`

Maybe you need to copy data in from over the Internet or write a script that transforms a dataset further before being ready to be imported. Here's a couple of options that keeps your code to do this right in the `data` directory.

- Write a standalone Typescript script that [sorts a dataset](https://github.com/mcclintock-lab/maldives-reports/blob/main/data/ous-demographic-data-sort.ts). Can be run from the root project directory with `npm run ts-node data/ous-demographic-data-sort.ts`
- Write a more complex Typescript script that uses Turf geoprocessing functions like [this proof of concept](https://github.com/mcclintock-lab/maldives-reports/blob/main/data/ous-demographic.ts)

# I need to change the `data:import` scripts

Maybe you need to alter the parameters passed to gdal or ogr. Many of the scripts that get run during data import are loaded from your projects `data/bin` directory. You can alter these scripts to meet your needs.

[Example](https://github.com/seasketch/fsm-reports/tree/main/data/bin)

If you upgrade your geoprocessing library, the files in `data/bin` will get overwritten and you'll need to look at the git code changes and re-merge your changes manually.

# I need my own data import

If the escape hatches above aren't enough, it is possible to skip the use of `data:import` entirely. Consider reserving this for datasource that you want to import directly into your but it won't be easy.

- Write your own script that pre-calculates metrics for your datasource
- Amend `project/projectClient.ts` to side-load your own custom datasource record and merge it with what is loaded from `datasources.json`
- You may The benefit of it is that it creates a datasource record in `project/datasources.json` which can then be referenced in `project/metrics.json`. These are read in by the `ProjectClient` in `project/projectClient.ts`, which is used by your functions and UI clients. To do this you can edit `projectClient.ts` to add your own custom datasources outside of the `datasources.json` file and merge them in. It's up to you to pre-calculate datasource metrics, and structure them properly if you still want to be able to run `data:publish`

# I need to extend the base types or code

Most things exported via the `client-core` and `client-ui` modules can be extended in `project-space`, whether it's UI components, base types/schemas, or utility functions. Here are some examples to get you started.

- The [rbcs](https://github.com/seasketch/geoprocessing/tree/dev/packages/geoprocessing/src/rbcs) module is a great example of extending all of these to create things specific to use of the `regulation-based classification system`.
- The ClassTable component is an extension of the base[Table](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/Table.tsx) component, capable of displaying metrics for one or more classes of data. And you can layer this multiple levels deep as the [SketchClassTable](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/SketchClassTable.tsx) component is an extension of the [ClassTable](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/ClassTable.tsx) component, capable of displaying metrics for all classes, for a SketchCollection with one or more sketches.

# I need to print my reports / save reports to PDF

Enabling printing of reports involves adding a state variable `isPrinting` which edits the UI so all our React elements are visible for the print dialog.

To begin, download and add [Print.tsx](https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/util/Print.tsx) to your `src/util` directory. This file contains much of the code you'll need to set up printing.

To include a small map overview of your sketch in your printed reports, you'll also need to download [PrintMap.tsx](https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/components/PrintMap.tsx) to your `src/components` directory, and [printMap.ts](https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/functions/printMap.ts) and it's test file [printMapSmoke.test.ts](https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/functions/printMapSmoke.test.ts) to your `src/functions` directory.

Run the following to install `react-to-print`:

```bash
npm install react-to-print
```

Open `MpaTabReport.tsx`. Start by importing the components we'll need:

```typescript
import { useReactToPrint } from "react-to-print";
import { PrintButton, PrintPopup, SketchAttributes } from "../util/Print";
import React, { useState, useRef, useEffect } from "react";
```

Next, we need add the following code in the MpaTabReport component. `printRef` will reference the component we wish to print, and `isPrinting` will reflect whether our print button was pressed and the component should display a print state. The `useEffect` hook waits to `isPrinting` to become true, and if so it disables animations on the page and runs the `handlePrint` command. In `handlePrint` we call `useReactToPrint` to print the component.

```typescript
// Printing
const printRef = useRef(null);
const [isPrinting, setIsPrinting] = useState(false);
const [attributes] = useSketchProperties();
// Original animation durations saved during printing
const originalAnimationDurations: string[] = [
  ...document.querySelectorAll(".chart"),
].map((el) => (el as HTMLElement).style.animationDuration);

useEffect(() => {
  // When printing, animations are disabled and the page is printed
  if (isPrinting) {
    [...document.querySelectorAll(".chart")].forEach(
      (el) => ((el as HTMLElement).style.animationDuration = "0s")
    );
    handlePrint();
  }
  // Return animation duration to normal after printing
  return () => {
    [...document.querySelectorAll(".chart")].forEach(
      (el, index) =>
        ((el as HTMLElement).style.animationDuration =
          originalAnimationDurations[index])
    );
  };
}, [isPrinting]);

// Print function
const handlePrint = useReactToPrint({
  content: () => printRef.current,
  documentTitle: attributes.name,
  onBeforeGetContent: () => {},
  onAfterPrint: () => setIsPrinting(false),
});
```

Now that we've configured what elements to print, we need to add a print button in the returned component, which will trigger the print dialog when clicked:

```typescript
<div
  onClick={() => {
    setIsPrinting(true);
  }}
>
  <PrintButton />
</div>;
{
  isPrinting && <PrintPopup />;
}
```

Finally, we need to attach `printRef` to our reports component. We also want to set all report pages to appear when `isPrinting` is true.

```typescript
<div
  ref={printRef}
  style={{ backgroundColor: isPrinting ? "#FFF" : "inherit" }}
>
  <div style={{ display: isPrinting ? "block" : "none" }}>
    <SketchAttributes {...attributes} />
  </div>
  <ReportPage hidden={!isPrinting && tab !== viabilityId}>
    <ViabilityPage />
  </ReportPage>
  <ReportPage hidden={!isPrinting && tab !== representationId}>
    <RepresentationPage />
  </ReportPage>
</div>
```

Printing is now set up for your reports. Additional printing edits may be added and are described below.

## Expanding collapsed dropdowns when printing

Many reports contain drop downs with additional data, such as `Show By MPA`, `Show by Zone`, or `Learn More` dropdowns. To configure reports to open the dropdowns when `isPrinting` is true, follow these instructions.

First, in `MpaTabReport.tsx`, pass `isPrinting` to all report pages:

```typescript
<ViabilityPage printing={isPrinting} />
```

Then, within `ViabilityPage.tsx`, pass `props.printing` into each report:

```typescript
<SizeCard printing={props.printing} />
```

Finally, within `SizeCard.tsx`, edit the `Collapse` object:

```typescript
{
  isCollection && (
    <Collapse
      title={t("Show by MPA")}
      collapsed={!props.printing}
      key={String(props.printing) + "MPA"}
    >
      {genNetworkSizeTable(data, precalcMetrics, metricGroup, t)}
    </Collapse>
  );
}
```

## Additional printing configuration

Depending on your report design, more edits may have to be made so your reports can print clearly. Some examples include handling horizontal scroll objects and pagination. See [fsm-nearshore-reports](https://github.com/seasketch/fsm-nearshore-reports/tree/main) for examples in handling those particulars.

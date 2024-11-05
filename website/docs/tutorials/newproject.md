# Create a New Geoprocessing Project

This tutorial walks through generating a new geoprocessing project. It assumes:

- Your [system setup](./Tutorials.md) is complete
- You have a VSCode app open in a devcontainer
- You have a VSCode terminal open.

## Initialize Geoprocessing Project

Start the project `init` process, which will download the framework, and collect required project metadata.

```sh
cd /workspaces
npx @seasketch/geoprocessing@latest init
```

For this example, assume you have a marine planning project in `The Federated States of Micronesia`. The planning area will be from the coastline to the outer boundary of the Exclusive Economic Zone (200 nautical miles).

```text
? Choose a name for your project fsm-reports-test
? Please provide a short description of this project Micronesia reports
? Source code repository location https://github.com/[YOUR_USERNAME_OR_ORG]/fsm-reports-test
? Your name [YOUR_NAME]
? Your email [YOUR_EMAIL]
? Organization name (optional)
? What software license would you like to use? BSD-3-Clause
? What AWS region would you like to deploy functions in? us-west-1
? What is the projects minimum longitude (left) in degrees (-180.0 to 180.0)? -180
? What is the projects minimum latitude (bottom) in degrees (-90.0 to 90.0)? -90
? What is the projects maximum longitude (right) in degrees (-180.0 to 180.0)? 180
? What is the projects maximum latitude (top) in degrees (-90.0 to 90.0)? 90
```

Few tips:

- [SeaSketch](https://github.com/seasketch/next/blob/master/LICENSE) uses a BSD-3 license (the default choice). You can choose `UNLICENSED` meaning proprietary or "All rights reserved" .
- The most common AWS region is `us-west-1` or `us-east-2`. Choose the location closest to your project.

After pressing Enter, your project will finish being created and installing all dependencies.

Now, re-open VSCode in your project folder::

```text
Click File -> Open Folder
Type /workspaces/fsm-reports-test/
Press Ctrl-J or Ctrl-backtick to open a terminal
```

## Connect Github repo and push

Now, [create a remote Github repository](https://github.com/new) called `fsm-reports-test`. Leave it empty, do not choose to initialize with a README, gitignore, or LICENSE.

Then connect your local repo and make your first code commit.

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/PUT_YOUR_GITHUB_ORG_OR_USERNAME_HERE/fsm-reports-test.git
git push -u origin main
```

You should see your files pushed to Github.

It may ask you if it can use the Github extension to sign you in using Github. It will open a browser tab and communicate with the Github website. If you are already logged in there, then it should be done quickly, otherwise it may have you login to Github.

After this point, you can continue using git commands right in the terminal to stage code changes and commit them if that's what you know, or you can use VSCode's [built-in git support](https://code.visualstudio.com/docs/sourcecontrol/overview).

You can learn more about your projects [folder structure](../structure.md)

## Generate Examples

Now generate an example feature, sketch and sketch collection using the `genRandomFeature` script.

```bash
npx tsx scripts/genRandomFeature.ts --bbox [147,4,153,7] --bboxShrinkFactor 5
npx tsx scripts/genRandomFeature.ts --bbox [147,4,153,7] --bboxShrinkFactor 5 --sketch
npx tsx scripts/genRandomFeature.ts --bbox [147,4,153,7] --bboxShrinkFactor 5 --sketch --numFeatures 10
```

These commands takes the approximate `bbox` of the Micronesian Exclusive Economic Zone given to it and reduces it by a factor of 5 using the `bboxShrinkFactor` option. It then generates random features that are within that reduced bbox. This is to ensure the features are guaranteed to be well within the Micronesian Exclusive Economic Zone polygon, based on its shape.

![EEZ bbox](./assets/eez-bbox.jpg)
bbox is the rectangle, EEZ is the light pink polygon within it, random SketchCollection is the cluster of small green polygons in the center.

Look at the file outputs and notice the difference between the example Feature and the example Sketch and Sketch Collection. Sketch and Sketch Collections are just a GeoJSON Feature and FeatureCollection with some extra attributes not in the [GeoJSON specification](https://datatracker.ietf.org/doc/html/rfc7946).

In addition to using `genRandomSketch`, you can create features and sketches using your GIS tool of choice, by drawing polygons using [geojson.io](https://geojson.io), or once you have your SeaSketch project setup, you can draw a sketch, right-click and export it as geojson, then copy it to the `examples/sketches` directory. These all ways to build a comprehensive test suite.

## Import Data

You will now import datasets from a package prepared for the Federated States of Micronesia (FSM). It is a combination of data from:

- [Marine Regions](https://marineregions.org)
- [Allen Coral Atlas](https://allencoralatlas.org/)

This tutorial skips over a lot of details. Visit the advanced guides to learn more.

- [Data import](../dataimport.md)
- [Third party data](../thirdpartydata/thirdpartydata.md)

Download the FSM data package:

```bash
wget -P data/src https://github.com/user-attachments/files/17607958/FSM_MSP_Data_Example_v2.zip
unzip data/src/FSM_MSP_Data_Example_v2.zip -d data/src
rm data/src/FSM_MSP_Data_Example_v2.zip
```

### EEZ With Land Boundary

First, we'll use the `eez_mr_osm` layer as the planning boundary. It's in the `boundaries` geopackage in the example data. It's a combination of the Marine Regions EEZ dataset and the OSM Land dataset.

```bash
npm run import:data
```

```text
? Type of data? Vector
? Select layer to import
  12nm_boundary_mr
  eez_withland_mr
  osm_land_polygons
❯ eez_mr_osm
  nearshore_mr_osm
  12_24nm_boundary_mr_v3
  eez_mr
? Should multi-part geometries be split into multiple single-part geometries? (can increase sketch overlap calc performance by reducing number of polygons
to fetch) Yes
? Enter path to src file (with filename) data/src/boundaries.gpkg
? Choose unique datasource name (use letters,numbers, -, _ to ensure will work) planning-boundary
? Enter layer name, defaults to filename eez_mr_osm
```

Skip the two following questions by pressing Enter

```text
? Select feature properties that you want to group metrics by (Press <space> to select, <a> to toggle all, <i>
to invert selection, and <enter> to proceed)
? Select additional feature properties to keep in final datasource (Press <space> to select, <a> to toggle all,
<i> to invert selection, and <enter> to proceed)
```

Press spacebar to create in JSON format also, then press Enter

```bash
? The following formats will automatically be created: fgb. What additional formats would you like created? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter>
 to proceed) (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◯ json - GeoJSON
```

Answer yes to precalculating summary metrics

```text
? Will you be precalculating summary metrics for this datasource after import? (Typically yes if reporting
sketch % overlap with datasource) (Use arrow keys)
❯ Yes
  No
```

At this point the import will proceed. Once complete you will find:

- The output file `data/dist/planning-boundary.fgb`.
- An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `planning-boundary`. You'll see all the answers to your questions.

If the import fails, try again double checking everything. It is most likely one of the following:

- You specified the wrong source file path.
- You specified the wrong layer name

### Other Datasources

Reef extent - single class dataset

```text
type: Vector
path: data/src/reefextent.gpkg
layer: Micronesian Exclusive Economic Zone
datasource name: reefextent
split multi-part geometries: yes
Select feature properties that you want to group metrics by: none
Select additional feature properties to keep in final datasource: none
Additional formats: none
Precalc summary statistics: yes
```

Benthic habitat - contains multiple classes of benthic data we can group metrics by

```text
type: Vector
path: data/src/benthic.gpkg
layer: Micronesian Exclusive Economic Zone
datasource name: benthic
split multi-part geometries: yes
Select feature properties that you want to group metrics by: class
Select additional feature properties to keep in final datasource: none
Additional formats: none
Precalc summary statistics: yes
```

Octocorals - raster with 0/1 values representing predicted presence/absence of species.

```text
type: Raster
path: data/src/yesson_octocorals.tif
layer: Micronesian Exclusive Economic Zone
datasource name: octocorals
Raster band: 1
Type of measurement: Quantitative
Precalc summary statistics: yes
```

Do not be concerned about an error that an ".ovr" file could not be found. This is expected. Once complete you will find:

Once complete, look at your `project/datasources.json` file to look at the new entries. You can make edits to this file and then run the `reimport:data` command to regenerate the files in `data/dist`.

### Update Geography

Open `project/geographies.json` to edit it.

Set `precalc` to `false` for the default `world` geography. This will exclude it from precalculation,

Now, add a geography for your planning boundary and save the file.

```json
{
  "geographyId": "planning-boundary",
  "datasourceId": "planning-boundary",
  "display": "Planning Boundary",
  "groups": ["default-boundary"],
  "precalc": true
}
```

## Precalc Data

You're now ready to precalculate metrics for your datasources. Precalc is all about calculating expensive spatial metrics ahead of time.

One of the questions our report needs to answer is "how much of all octocorals in the EEZ, is within my Sketch polygon"?

This is calculated as:
`octocorals sketch % = area of octocorals within sketch / area of octocorals within EEZ`

You can precalculate the denominator of this equation ahead of time. The `precalc` command will calculate how much of a datasources features/raster cells is within each of your projects geographies. This can measured as an `area`, `sum` of cell value, `count` of features/raster cells, etc.

Since your datasources and geographies all have `precalc: true` set you are ready to start:

```bash
npm run precalc:data

? Do you want to precalculate only a subset?
  Yes, by datasource
  Yes, by geography
  Yes, by both
❯ No, just precalculate everything (may take a while)
```

Choose to "precalculate everything". Then press enter:

- The precalc process may take at least a few minutes.
- Precalc will start a web server on localhost port 8001 that serve up data from `data/dist`.
- Precalc will see the two datasources you selected and that they have `precalc: true`. It will also see the one geography `eez` that is defined in geographies.json that has `precalc: true`. It will then calculate `area`, `sum`, and `count` metrics for each datasource, in combination with each geography.
- `project/precalc.json` will be updated with the new values.

Tips for precalculation:

- You have to re-run `precalc:data` every time you change a geography or datasource.
- Set `precalc:false` for datasources that are not currently used, or are only used to define a geography (not displayed in reports). This is why the datasource for the default geography for a project is always set by default to `precalc: false`.
- If you are using one of the [global-datasources](https://github.com/seasketch/global-datasources) in your project, and you want to use it in reporting % sketch overlap, so you've set `precalc:true`, strongly consider defining a `bboxFilter`. This will ensure that precalc doesn't have to fetch the entire datasource when precalculating a metric, which can be over 1 Gigabyte in size. Also consider setting a `propertyFilter` to narrow down to just the features you need. This filter is applied on the client-side so it won't reduce the number of features you are sending over the wire.

## Create Metric Group

The metric group is your central report configuration. There is one metric group per individual report. It links everything together and defines what data you want to show in the individual report. The metric group is used in both the function that calculates statistics and the component which displays the results. Often, projects will include ~8 reports, with each report focusing on a goal or type of data.

Navigate to `metrics.json`, where metric groups are stored. There is already a report here – `boundaryAreaOverlap`. This is the metric group used to calculate how much of the EEZ is within our sketch, using the `global-eez-mr-v12` datasource we [precalculated](#precalc-data).

We’re going to create a report that uses the `reefextent` layer just imported. We want to see how much our sketch overlaps with reefs. Pick a metricId to be the title of your report in camelCase (`coralReef`), the type of report (`areaOverlap`), and the classes you want to show in the report. Your classes can look a myriad of ways, depending on whether all the data is from a single file, or multiple files. All data within a metric group must be in the same format (raster or vector).

Our example `reefextent` data is a simple vector file. We can set classId to be anything. Our metric group looked as follows:

```json
{
  "metricId": "coralReef",
  "type": "areaOverlap",
  "classes": [
    {
      "classId": "reefextent",
      "display": "Coral Reef",
      "datasourceId": "reefextent"
    }
  ]
}
```

### Metric group for vector data source with multiple classes

Our example data `benthic` is a single file with different habitats defined by a `class` parameter. While there were many types of habitats, we may want to only focus on Sand, Rubble, and Rock. In this case, `classKey` must be `class` and `classIds` have to match the features in the vector file. My metric group would look like this:

```json
{
  "metricId": "benthicHabitat",
  "type": "areaOverlap",
  "classes": [
    {
      "classId": "Sand",
      "classKey": "class",
      "display": "Sand",
      "datasourceId": "benthic"
    },
    {
      "classId": "Rock",
      "classKey": "class",
      "display": "Rock",
      "datasourceId": "benthic"
    },
    {
      "classId": "Rubble",
      "classKey": "class",
      "display": "Rubble",
      "datasourceId": "benthic"
    }
  ]
}
```

### Metric group with two data sources

You can have classes from multiple data sources in one metric group. If we wanted both the reef extent data and benthic habitat data in one report, the metric group can look as follows:

```json
{
  "metricId": "benthicHabitat",
  "type": "areaOverlap",
  "classes": [
    {
      "classId": "reefextent",
      "display": "Coral Reef",
      "datasourceId": "reefextent"
    },
    {
      "classId": "Sand",
      "classKey": "class",
      "display": "Sand",
      "datasourceId": "benthic"
    },
    {
      "classId": "Rock",
      "classKey": "class",
      "display": "Rock",
      "datasourceId": "benthic"
    },
    {
      "classId": "Rubble",
      "classKey": "class",
      "display": "Rubble",
      "datasourceId": "benthic"
    }
  ]
}
```

### Metric group with quantitative raster data sources

An example of a metric group `fishingEffort` which displays multiple quantitative raster data files. This report has been made using [Global Fishing Watch Apparent Fishing Effort data](https://globalfishingwatch.org/dataset-and-code-fishing-effort/), which reports fishing effort in hours. To calculate for the sum of fishing effort within our plan, we would use `type = valueOverlap`.

```json
{
  "metricId": "fishingEffort",
  "type": "valueOverlap",
  "classes": [
    {
      "datasourceId": "all-fishing",
      "classId": "all-fishing",
      "display": "All Fishing 2019-2022"
    },
    {
      "datasourceId": "drifting-longlines",
      "classId": "drifting-longlines",
      "display": "Drifting Longline"
    },
    {
      "datasourceId": "pole-and-line",
      "classId": "pole-and-line",
      "display": "Pole and Line"
    },
    {
      "datasourceId": "set-longlines",
      "classId": "set-longlines",
      "display": "Set Longline"
    },
    {
      "datasourceId": "fixed-gear",
      "classId": "fixed-gear",
      "display": "Fixed Gear"
    }
  ]
}
```

### Metric group with categorical raster data sources

An example of a metric group `fishRichness` which displays a categorical raster `fishRichness.tif`. The raster data displays the number of key fish species present in each raster cell -- from 1 to 5 species. `classId` should be set to the corresponding numerical value within the raster.

```json
{
  "metricId": "fishRichness",
  "type": "countOverlap",
  "classes": [
    {
      "datasourceId": "fishRichness",
      "classId": "1",
      "display": "1 species"
    },
    {
      "datasourceId": "fishRichness",
      "classId": "2",
      "display": "2 species"
    },
    {
      "datasourceId": "fishRichness",
      "classId": "3",
      "display": "3 species"
    },
    {
      "datasourceId": "fishRichness",
      "classId": "4",
      "display": "4 species"
    },
    {
      "datasourceId": "fixed-gear",
      "classId": "5",
      "display": "5 species"
    }
  ]
}
```

## Create Report

```bash
npm run create:report
```

Select the type of report you need for your data (`vector` or `raster`), and the name of your new metric group. For this tutorial, select `Vector overlap report` and [`benthicHabitat`](#metric-group-with-two-data-sources).

This command does a lot for you:

- Adds a function to `src/functions`
- Adds a test file to `src/functions`
- Adds a component (the front-end of any report) to `src/components`
- Adds a story to `src/components`
- Adds your new function to a list in `geoprocessing.json` that is used by AWS lambda

Open these outputs and take a look at them. Edits to the statistic you want calculated (i.e.calculating average instead of sum, etc) should happen in your function (in this tutorial: `src/functions/benthicHabitat.ts`). Edits to the way the analytics are displayed (i.e. changing labels, converting units, adding text context, etc) should happen in your component (in this tutorial: `src/components/BenthicHabitat.tsx`).

Add your new component to `src/components/ViabilityPage.tsx` or `src/components/RepresentationPage.tsx`. For example, `Viability.tsx` can now look like this, so our new report appears beneath the Size report and the Sketch Attributes report:

```typescript
import React from "react";
import { SizeCard } from "./SizeCard";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { BenthicHabitat } from "./BenthicHabitat";

const ReportPage = () => {
  return (
    <>
      <SizeCard />
      <BenthicHabitat />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ReportPage;
```

## Test your project

Now that you have sample sketches and features, you can run the test suite.

```bash
npm run test
```

This will start a web server on port 8080 that serves up the `data/dist` folder. Smoke tests will run geoprocessing functions against all of the sketches and features in the `examples` folder. `projectClient.getDatasourceUrl` will automatically read data from localhost:8080 instead of the production S3 bucket url using functions like `fgbFetchAll()`, `geoblaze.parse()`.

### Smoke Tests

Smoke tests, in the context of a geoprocessing project, verify that your preprocessing and geoprocessing function are working, and produce an output, for a given input. It doesn't ensure that the output is correct, just that something is produced. The input in this case is a suite of features and sketches that you manage.

Preprocessing function smoke tests (in this case `src/functions/clipToOceanEezSmoke.test.ts`) will run against every feature in `examples/features` and output the results to `examples/output`.

All geoprocessing function smoke tests (in this case `src/functions/boundaryAreaOverlapSmoke.test.ts`) will run against every feature in `examples/sketches` and output the results to `examples/output`.

Smoke tests are your chance to convince yourself that functions are outputting the right results. This output is committed to the code repository as a source of truth, and if the results change in the future (due to a code change or an input data change or a dependency upgrade) then you will be able to clearly see the difference and convince yourself again that they are correct. All changes to smoke test output are for a reason and should not be skipped over.

### Unit Tests

Units tests go further than smoke tests, and verify that output or behavior is correct for a given input.

You should have unit tests at least for utility or helper methods that you write of any complexity, whether for geoprocessing functions (backend) or report clients (frontend).

- [Example](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/helpers/groupBy.test.ts)

You can also write unit tests for your UI components using [testing-library](https://testing-library.com/docs/react-testing-library/intro/).

- [Example](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesCard.test.tsx)

Each project you create includes a debug launcher which is useful for debugging your function. With the geoprocessing repo checked out and open in VSCode, just add a breakpoint or a `debugger` call in one of your tests or in one of your functions, click the `Debug` menu in the left toolbar (picture of a bug) and select the appropriate package. The debugger should break at the appropriate place.

### Debugging Tests

See the [Testing](../Testing.md) page for additional options for testing your project.

### Default geography

When smoke tests run, they should run for the default geography, without needing to be told so, but you can still override it. That's why this is the standard boilerplate for a geoprocessing function.

```typescript
  export async function boundaryAreaOverlap(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  extraParams: DefaultExtraParams = {}
): Promise<ReportResult> {
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
```

If you call boundaryAreaOverlap with only a sketch as input (no extraParams), then `getFirstFromParam()` will return `undefined`, so
`project.getGeographyById` will receive `undefined` and fallback to the geography assigned to the `default-boundary` group, which every project should have at least one, or throw an error.

If you want to run smoke tests against a different geography, just to see what it produces, then you will have to do it explicitly:

```typescript
const metrics = await boundaryAreaOverlap(sketch, {
  geographyIds: ["my-other-geography"],
});
```

if you use a `GeographySwitcher` UI component in your story, then it will allow you to switch geographies, but the story will still only receive the metrics for the smoke test you ran, which may only have been run for the default geography. In this situation, the report will load the precalc metrics for the geography you've chosen in the denominator for percentages, but the numerator metrics will always be for the default geography, or whatever geography you passed to your smoke test.

If you've used template-ocean-eez and selected an EEZ, the default geography is your selected EEZ, and you're ready to run your storybook and check out your reports!

## Storybook

You can view the results of your smoke tests using Storybook. It's already configured to load all of the smoke test output for each story.

```bash
npm run storybook
```

Check out [advanced storybook usage](./storybook.md) when necessary.

From here on, you can continue to extend your reports -- adding more, [adding language translation](../gip/GIP-1-i18n.md#language-translation-tutorial), adding additional data and new analytics, etc. After this point, we need to integrate with AWS so the reports can be hosted and connected to your seasketch.com project.

## First Project Build

A `build` of your application packages it for deployment, so you don't have to build it until you are ready. Specifically it:

- Checks all the Typescript code to make sure it's valid and types are used properly.
- Transpiles all Typescript to Javascript
- Bundles UI report clients into the `.build-web` directory
- Bundles geoprocessing and preprocessing functions into the `.build` directory.

To build your application run the following:

```bash
npm run build
```

### Debugging build failure

If the build step fails, you will need to look at the error message and figure out what you need to do. Did it fail in building the functions or the clients? 99% of the time you should be able to catch these errors sooner. If VSCode finds invalid Typescript code, it will warn you with files marked in `red` in the Explorer panel or with red markes and squiggle text in any of the files.

If you're still not sure try some of the following:

- Run your smoke tests, see if they pass
- When was the last time your build did succeed? You can be sure the error is caused by a change you made since then either in your project code, by upgrading your geoprocessing library version and not migratin fully, or by changing something on your system.
- You can stash your current changes or commit them to a branch so they are not lost. Then sequentially check out previous commits of the code until you find one that builds properly. Now you know that the next commit cause the build error.

### What Next

There are a number of guides covering advanced topics.

There are also many report projects you can look at to gain a better understanding or to add more advanced features.

- [California](https://github.com/seasketch/california-reports) - worker functions, v7
- [Bermuda](https://github.com/seasketch/bermuda-reports-next) - worker functions, v7
- [Blue Azores nearshore](https://github.com/seasketch/azores-nearshore-reports) - geography switching
- [Samoa Reports](https://github.com/seasketch/samoa-reports)
- [Azores Nearshore Reports](https://github.com/seasketch/azores-nearshore-reports).

# Create a New Geoprocessing Project

This tutorial walks through creating a new geoprocessing project for the Federated States of Micronesia and creating a report that does overlay analysis. The planning area for this example is defined as the coastline to the outer boundary of the Exclusive Economic Zone (200 nautical miles).

This tutorial assumes:

- Your [system setup](./Tutorials.md) is complete
- Your Ubuntu virtual environment is running (Devcontainer or WSL)
- You have VSCode open in your virtual environment with a terminal pane open

Note: if your project requirements are drastically different than the features utilized in this tutorial, then you don't have to use them. You can look at their building blocks, and create something that meets your needs. See the [Extending](../Extending.md) page to learn more.

## Initialize Geoprocessing Project

Start the project `init` process, which will download the framework, and collect required project metadata.

```sh
cd /workspaces
npx @seasketch/geoprocessing@7.0.0-experimental-7x-simplify.33 init 7.0.0-experimental-7x-simplify.33
```

```text
? Choose a name for your project fsm-reports-test
? Please provide a short description of this project Micronesia reports
? Source code repository location https://github.com/[YOUR_USERNAME_OR_ORG]/fsm-reports-test
? Your name [YOUR_NAME]
? Your email [YOUR_EMAIL]
? Organization name (optional)
? What software license would you like to use? BSD-3-Clause
? What AWS region would you like to deploy functions in? us-west-1
? What languages will your reports be published in, other than English? (leave blank for none) Portuguese
```

After pressing Enter, your project will be created and all NodeJS software dependencies installed.

Few tips:

- If you leave the questions about project latitude/longitude blank it will default to the extent of the entire world.
- [SeaSketch](https://github.com/seasketch/next/blob/master/LICENSE) uses a BSD-3 license (the default choice). You can choose any including `UNLICENSED` meaning proprietary or "All rights reserved" .
- The most common AWS region is `us-west-1` or `us-east-2`. [Choose the region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) closest to your project.

Now, re-open VSCode one level deeper, in your project folder::

```text
Click File -> Open Folder
Type /workspaces/fsm-reports-test/
Press Ctrl-J or Ctrl-backtick to open a new terminal
```

## Connect Github repo and push

Before you continue, let's take a snapshot of your code now, at the starting point.

[Create a remote Github repository](https://github.com/new) called `fsm-reports-test`. Leave it empty, do not choose to initialize with a template, README, gitignore, or LICENSE.

Then connect your local repo and make your first code commit:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/PUT_YOUR_GITHUB_ORG_OR_USERNAME_HERE/fsm-reports-test.git
git push -u origin main
```

You should see your files successfuly pushed to Github.

It may ask you if it can use the Github extension to sign you in using Github. It will open a browser tab and communicate with the Github website. If you are already logged in there, then it should be done quickly, otherwise it may have you login to Github.

After this point, you can continue using git commands right in the terminal to stage code changes and commit them if that's what you know, or you can use VSCode's [built-in git support](https://code.visualstudio.com/docs/sourcecontrol/overview).

You can learn more about your projects [folder structure](../structure.md)

## Import Data

You will now import datasets from a package prepared for the Federated States of Micronesia (FSM). This section will skip over a lot of details, so visit the advanced guides to learn more at a later time.

- [Data import](../dataimport.md)
- [Third party data](../thirdpartydata/thirdpartydata.md)

Download the FSM data package:

```bash
wget -P data/src https://github.com/user-attachments/files/17607958/FSM_MSP_Data_Example_v2.zip
unzip data/src/FSM_MSP_Data_Example_v2.zip -d data/src
rm data/src/FSM_MSP_Data_Example_v2.zip
```

### EEZ With Land Boundary

First, you'll load the `eez_mr_osm` layer as the planning boundary. It's in the `boundaries` geopackage of the example data. It was created with a combination of the Marine Regions EEZ dataset and the OSM Land dataset.

```bash
npm run import:data
```

```text
? Type of data?
Vector
? Enter path to src file (with filename)
data/src/boundaries.gpkg
? Select layer to import
eez_mr_osm
? Should multi-part geometries be split into multiple single-part geometries? (can increase sketch overlap calc performance by reducing number of polygons
to fetch)
Yes
? Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename
planning-boundary
? Enter layer name, defaults to filename
eez_mr_osm
```

Skip the two following questions by pressing Enter

```text
? Select feature properties that you want to group metrics by (Press <space> to select, <a> to toggle all, <i>
to invert selection, and <enter> to proceed)
? Select additional feature properties to keep in final datasource (Press <space> to select, <a> to toggle all,
<i> to invert selection, and <enter> to proceed)
```

Press spacebar to add JSON as an additional format created for your dataset on import, then press Enter

```bash
? The following formats will automatically be created: fgb. What additional formats would you like created? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter>
 to proceed) (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◯ json - GeoJSON
```

Answer yes to precalculating summary metrics

```text
? Will you be precalculating summary metrics for this datasource after import? (Typically yes if reporting
sketch % overlap with datasource) (Use arrow keys)
Yes
```

The import will now proceed. Once complete you will find:

- The output file `data/dist/planning-boundary.fgb`.
- An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `planning-boundary`.

If the import fails, start the import over and double check everything. It is most likely one of the following:

- You specified the wrong source file path.
- You specified the wrong layer name

### Other Datasources

Now import the following additional datasources:

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

Benthic habitat - multiple classes of benthic data

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
datasource name: octocorals
Raster band: 1
Type of measurement: Quantitative
Precalc summary statistics: yes
```

When importing raster data, do not be concerned about an error that an ".ovr" file could not be found. This is expected.

Once imported, you'll find the resulting datasets in `data/dist`. You'll also find new entries for each datasource in `project/datasources.json`. At any point, you can make edits to this file and then run `reimport:data` to regenerate the files in `data/dist`.

### Update default Geography

Now you change the projects default geography from the world, to your new planning boundary.

- Open `project/geographies.json`. You will see an array with one geography record called `world`. This is the default geography and can stay. You will disable its precalc and remove it as the `default-boundary`. Then you will add a new geography record for your `planning-boundary`.
- Update the geographies file to the following and save it:

```json
[
  {
    "geographyId": "world",
    "datasourceId": "world",
    "display": "World",
    "groups": [],
    "precalc": false
  },
  {
    "geographyId": "planning-boundary",
    "datasourceId": "planning-boundary",
    "display": "Planning Boundary",
    "groups": ["default-boundary"],
    "precalc": true
  }
]
```

## Generate Examples

Next, you will generate some example features and sketches that fall within your planning boundary, for testing purposes.

First, get the bounding box of your planning boundary. We'll do this using a combination of ogrinfo and jq commands.

First, let's look at the properties of the planning-boundary datasource

```bash
ogrinfo -so -json data/dist/planning-boundary.fgb eez_mr_osm
```

Looking at the output, you'll see there is one layer, with a `geometryFields` property, which contains the bounding box extent of the layer. That is what you need.

You can use the `jq` utility to extract it as follows:

```bash
ogrinfo -so -json data/dist/planning-boundary.fgb eez_mr_osm | jq -c .layers[0].geometryFi
elds[0].extent
```

It should output the following compact bounding box extent:

```json
[135.312441837621, -1.17311096529859, 165.676528225997, 13.4454329253893]
```

Run the genRandomPolygon script with this bounding box (make sure there are no spaces) to create a Feature polygon, a Sketch polygon, and then finally a SketchCollection containing 10 Sketch polygons.

```bash
npx tsx scripts/genRandomPolygon.ts --bbox "[135.312441837621,-1.17311096529859,165.676528225997,13.4454329253893]" --bboxShrinkFactor 5
npx tsx scripts/genRandomPolygon.ts --bbox "[135.312441837621,-1.17311096529859,165.676528225997,13.4454329253893]" --bboxShrinkFactor 5 --sketch
npx tsx scripts/genRandomPolygon.ts --bbox "[135.312441837621,-1.17311096529859,165.676528225997,13.4454329253893]" --bboxShrinkFactor 5 --sketch --numFeatures 10
```

These commands contain a `bbox` and a `bboxShrinkFactor` argument. This shrinks the height and width of the given bbox by a factor of 5, and then generates random features that are within that reduced bbox. You do this to ensure the generated features are completely within the planning area polygon, because the planning area is smaller than its bounding box (see image below).

![EEZ bbox](./assets/eez-bbox.jpg)
Image: cluster of 10 random sketches (in orange) within Micronesia EEZ

You can adjust these options as you see fit. Learn more about the options by running:

```
npx tsx scripts/genRandomPolygon.ts --help
```

## Run test suite

Now that you have example features and sketches, you can test the preprocessing and geoprocessing functions that came with your blank project. Run the test suite now:

```bash
npm test
```

The two preprocessing functions (clipToOcean, clipToLand) will run against Features in `examples/features`. The two geoprocessing functions (blankFunction, simpleFunction) will run against Sketches in `examples/sketches`. The results of all smokes tests is output to the `examples/output` directory so that you can inspect the output, and changes over time.

In addition to using `genRandomFeatures`, you can create example features and sketches relevant to your project using GIS software, by drawing polygons using [geojson.io](https://geojson.io), or once you have your SeaSketch project setup, you can draw a sketch, right-click and export it as geojson, then copy it to the `examples/sketches` directory. These are all ways to build a comprehensive test suite.

## Precalc Data

You're now ready to precalculate metrics for your datasources. Precalc is all about calculating expensive spatial metrics ahead of time.

One of the questions our report needs to answer is "how much of all octocorals in the EEZ, is within my Sketch polygon"?

This is calculated as:
`octocorals sketch % = area of octocorals within sketch / area of octocorals within EEZ`

You can precalculate the denominator of this equation ahead of time. The `precalc` command will calculate how much of a datasources features/raster cells is within each of your projects geographies. This can measured as an `area`, `sum` of cell value, `count` of features/raster cells, etc.

Since your datasources and geographies already have `precalc: true` set, you are ready to start:

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

## Add Metric Groups

A metric group defines a metric to be measured, for one or more classes of data.

A metric group record provides all of the information needed for the metric to be calculated (in a geoprocessing function) and to be displayed (in a report client).

You can learn more on the [advanced concepts](../concepts/AdvancedConcepts.md#metric-group) page.

Now, navigate to `metrics.json`. There is already a metric group defined – `boundaryAreaOverlap`. This is the metric group used to calculate how much of the the total area of the planning boundary is within our sketch.

You will be creating a report that measures how much a sketch overlaps with reefs within the planning boundary. The first step is to define a metric group.- Pick a metricId (`coralReef`)

- type of report (`areaOverlap`)
- and classes you want to show in the report. In this case our dataset has only one class of data, and it all comes from one datasource. All data within a metric group must be in the same format (raster or vector).

Add the following record to the end of the array in `project/metrics.json` and save the file.

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

Next add a metric group for measuring sketch overlap with predicted presence of benthic species. `benthic` is made up of a single datasource with multiple habitats defined by the `class` attribute. While there were many types of habitats, we may want to only focus on Sand, Rubble, and Rock. To do this, you'll add multiple class records, each with a `classKey` of `class` and a `classId` with a value to match on.

Add the following record to the end of the array in `project/metrics.json` and save the file.

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

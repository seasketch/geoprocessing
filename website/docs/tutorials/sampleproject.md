# Create Sample Project

This tutorial walks through creating a sample geoprocessing project for the Federated States of Micronesia and creating a report that does overlay analysis. The planning area for this example is defined as the coastline to the outer boundary of the Exclusive Economic Zone (200 nautical miles).

This tutorial assumes:

- Your [system setup](./Tutorials.md) is complete
- Your geoprocessing virtual environment is running (Devcontainer or WSL)
- You have VSCode open in your virtual environment with a terminal pane open

Have questions? Start a [discussion](https://github.com/seasketch/geoprocessing/discussions) on Github

## Initialize Geoprocessing Project

Start the project `init` process, which will download the framework, and collect required project metadata.

```sh
cd /workspaces
npx @seasketch/geoprocessing@7.0.0-experimental-7x-simplify.36 init 7.0.0-experimental-7x-simplify.36
```

```text
? Choose a name for your project
fsm-reports-test
? Please provide a short description of this project
Micronesia reports
? Source code repository location
[LEAVE BLANK]
? Your name
[YOUR_NAME]
? Your email
[YOUR_EMAIL]
? Organization name (optional)
Example organization
? What software license would you like to use?
BSD-3-Clause
? What AWS region would you like to deploy functions in?
us-west-1
? What languages will your reports be published in, other than English? (leave blank for none)
Chuukese
Kosraean
```

After pressing Enter, your project will be created and all NodeJS software dependencies installed.

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

You will now download a data package prepared for the Federated States of Micronesia (FSM).

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

Learn more in these advanced guides:

- [Data import](../dataimport.md)
- [Third party data](../thirdpartydata/thirdpartydata.md)

### Update default Geography

Now change the projects default geography from the world, to your new planning boundary.

- Open `project/geographies.json`. You will see an array with one geography record called `world`. This is the default geography and can be left here. You will disable its precalc and remove it from the `default-boundary` group, then add a new geography record for your `planning-boundary`.
- Replace the contents of the geographies file with the following and save it:

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

Next, generate example features and sketches that fall within your planning boundary, for testing purposes.

To do this, first look at the properties of the planning-boundary datasource.

```bash
ogrinfo -so -json data/dist/planning-boundary.fgb eez_mr_osm
```

You will see deep in the output a `geometryFields` property, which contains the bounding box extent of all its features. Use the `jq` utility to extract this extent:

```bash
ogrinfo -so -json data/dist/planning-boundary.fgb eez_mr_osm | jq -c .layers[0].geometryFields[0].extent
```

This will output just the extent:

```json
[135.312441837621, -1.17311096529859, 165.676528225997, 13.4454329253893]
```

Now, run the genRandomPolygon script with this extent, to create a Feature polygon, a Sketch polygon, and then a SketchCollection containing 10 Sketch polygons.

```bash
npx tsx scripts/genRandomPolygon.ts --bbox "[135.312441837621,-1.17311096529859,165.676528225997,13.4454329253893]" --bboxShrinkFactor 5
npx tsx scripts/genRandomPolygon.ts --bbox "[135.312441837621,-1.17311096529859,165.676528225997,13.4454329253893]" --bboxShrinkFactor 5 --sketch
npx tsx scripts/genRandomPolygon.ts --bbox "[135.312441837621,-1.17311096529859,165.676528225997,13.4454329253893]" --bboxShrinkFactor 5 --sketch --numFeatures 10
```

The `--bboxShrinkFactor` argument used shrinks the height and width of the given bbox by a factor of 5, and then generates random features that are within that reduced bbox. A suitable shrink factor value was discovered through trial and error. Simply visualize the resulting json file in QGIS or other software and find a value that produces polygons that are completely within the planning area polygon. (see image below).

![EEZ bbox](./assets/eez-bbox.jpg)
Image: cluster of 10 random sketches (in orange) within Micronesia EEZ

Learn more about the options for `genRandomPolygon` by running:

```
npx tsx scripts/genRandomPolygon.ts --help
```

## Run test suite

Now that you have example features and sketches, you can test the preprocessing and geoprocessing functions that came with your blank project. Run the test suite now:

```bash
npm test
```

- The two preprocessing functions (clipToOcean, clipToLand) will run against all the polygon Features in `examples/features`.
- The two geoprocessing functions (blankFunction, simpleFunction) will run against all of the polygon Sketches in `examples/sketches`.
- The results of all smokes tests are output to the `examples/output` directory.
- You can inspect the output files, rerun tests to regenerate them at any time, and delete any that are stale and no longer needed.

Commit the output files to your git repository at this time.

For advanced use, check out the [testing](../Testing.md) guide.

## Precalc Data

The `precalc` command will calculate how much of your datasources features/raster cells are within each of your projects geographies. This can measured as an `area`, `sum` of cell value, pr `count` of features/raster cells.

Why do this?

One of the questions our report needs to answer is "what percentage of coral reef within the planning boundary are within my Sketch polygon?

This is calculated as:
`% area of coral reef in sketch = area of coral reef within sketch / area of coral reef within planning boundary`

The numerator in this equation (area of reef within sketch) is relatively inexpensive to calculate and we will do it within a geoprocessing function where we have access to the sketch. But the denominator calculation can be expensive if the data is very large or complex. Thankfully we can calculate it ahead of time.

Since your datasources and geographies already have `precalc: true` set, you are ready to start:

```bash
npm run precalc:data

? Do you want to precalculate only a subset?
  Yes, by datasource
  Yes, by geography
  Yes, by both
❯ No, just precalculate everything (may take a while)
```

Choose to "precalculate everything". Then press enter. The precalc process may take a while.

What's happening is that the precalc script starts a local web server on port 8001 that serves up the datasources in `data/dist`.

The precalc script then gets all your project datasources with `precalc: true`, and all your project geographies with `precalc: true`, and then calculate `area`, `sum`, and `count` metrics for each combination of datasource and geography.

Once complete `project/precalc.json` will have been updated with the new metric values.

- To learn more advanced use, see the [precalc](../precalc.md) guide.
- To learn more about use of precalculated metrics, see the [report client](../reportclient.md) guide.

## Add Metric Groups

A metric group defines a metric to be measured, for one or more classes of data. A `MetricGroup` record provides the information needed for a metric to be calculated (in a geoprocessing function) and to be displayed (in a report client).

Let's create your first metric group by opening `project/metrics.json`.

You will be creating a report that measures how much a sketch overlaps with reefs within the planning boundary.

Choose:

- a metricId (`coralReef`)
- a type of report (`areaOverlap`)
- classes you want to show in the report (`reefExtent`) and the datasource they are sourced from (`reefextent`)
  - In this case our dataset has only one class of data, and it all comes from one datasource.

Add the following record to the end of the empty array in `project/metrics.json` and save the file.

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

To learn more about metric groups, visit the [advanced concepts](../concepts/AdvancedConcepts.md#metric-group) page.

### Metric group for vector data source with multiple classes

Next, add a metric group for measuring sketch overlap with areas where benthic species are predicted to be present. `benthic` consists of a single vector datasource with multiple habitats defined by the `class` attribute. While there are many types of habitats, we want to only focus on Sand, Rubble, and Rock. To do this, you'll add multiple class records, each with a unique `classId` value to match on, and a `classKey` that specific which feature attribute the classId values are found.

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

## Create Benthic Report

We now have everything we need to generate our first report (geoprocessing function + report component).

This command asks you to choose one of your unused metric groups, and then it:

- Creates a new geoprocessing function in `src/functions`
- Creates an accompanying smoke test file
- Creates a React component that displays the result metrics in `src/components`.
- Creates an accompanying storybook story generator
- Adds your new geoprocessing function to the list in `project/geoprocessing.json` so that it will be published on deploy.

These assets are all created using the `blank` assets that are in your project, so it's important that you leave them in place:

- src/functions/blankFunction.ts
- src/functions/blankFunctionSmoke.test.ts
- src/components/BlankCard.tsx
- src/components/BlankCard.example-stories.tsx

To get started run the command:

```bash
npm run create:report
```

Answer the questions as follows:

```text
? Type of report to create

Vector overlap report

? Describe what this reports geoprocessing function will calculate

Calculate sketch overlap with benthic habitats

? Choose an execution mode for the geoprocessing function for this report

Async - Better for long-running processes

? Select the metric group to report on

benthicHabitat

```

Read the results, and open the output files and take a look at them.

- Edits to the statistic you want calculated (i.e.calculating average instead of sum, etc) should happen in your function (`src/functions/benthicHabitat.ts`).
- Edits to the way the analytics are displayed (i.e. changing labels, converting units, adding text context, etc) should happen in your component (`src/components/BenthicHabitat.tsx`).

Now, add your new component to the Viability report page (`src/components/RepresentationPage.tsx`) as follows:

```typescript
import React from "react";
import { SimpleCard } from "./SimpleCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { BenthicHabitat } from "./BenthicHabitat.js";

export const ViabilityPage = () => {
  return (
    <>
      <SimpleCard />
      <BenthicHabitat />
      <SketchAttributesCard autoHide />

    </>
  );
};
```

## Add Preprocessing Function

[Work in progress]

This project comes with two example preprocessing functions - `clipToLand` and `clipToOcean`. You will add a new preprocessing function called `clipToOceanEez` that combines multiple of these steps.

### Add Example Feature to clip

```typescript

```

[Image: before clip]
[Image: after, verify clip]

## Disable unused pieces

In `project/geoprocess.json`

- Remove `clipToLand` and `clipToOcean` preprocessing functions, leaving `clipToOceanEez`

## Test your project

Now, rerun your test suite to generate new smoke test output.

```bash
npm run test
```

## Storybook

You can view your report clients with the results of your smoke tests using Storybook.

```bash
npm run storybook
```

Check out [advanced storybook usage](./storybook.md) when necessary.

## First Project Build

A `build` of your application packages it for deployment. Specifically it:

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

### What's Next

You've now completed the sample tutorial. If you have an [existing project to setup](./existingproject.md) or would like to [create a new project](./newproject.md), you can do that now.

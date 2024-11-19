# Create Sample Project

This tutorial walks through creating a sample geoprocessing project for the Federated States of Micronesia and creating a report that does overlay analysis. The planning area for this example is defined as the coastline to the outer boundary of the Exclusive Economic Zone (200 nautical miles).

This tutorial assumes:

- Your [system setup](./Tutorials.md) is complete
- Your geoprocessing virtual environment is running (Devcontainer or WSL)
- You have VSCode open in your virtual environment with a terminal pane open

Have questions along the way? Start a [discussion](https://github.com/seasketch/geoprocessing/discussions) on Github

## Initialize Geoprocessing Project

Start the project `init` process, which will download the framework, and collect required project metadata.

```sh
cd /workspaces
npx @seasketch/geoprocessing@7.0.0-experimental-7x-docs.73 init 7.0.0-experimental-7x-docs.73
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

After pressing Enter, your project will be created and all NodeJS software dependencies installed. If your language is not present, you will be able to add it later.

Now, re-open VSCode one level deeper, in your project folder::

```text
File -> Open Folder
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

After this point, you can continue using git commands in the terminal to stage code changes and commit them if that's what you know, or you can use VSCode's [built-in git support](https://code.visualstudio.com/docs/sourcecontrol/overview).

You can learn more about your projects [folder structure](../structure.md)

## Preprocessing

Preprocessing function are invoked by the SeaSketch platform, on a user-drawn shape, right after the user finishes drawing it. It's a specialized function that validates a drawn shape and potentially modifies it, such as to remove portions of the shape outside the planning boundary. This "clipping" of the shape is useful in that it allows a user to overdraw beyond the planning boundary and it will be clipped right to the edge of that boundary.

In the `src/functions` directory you will find four preprocessing functions that come with every project, and they are further configureable to meet your needs:

- `validatePolygon` - verifies shape is not self-crossing, is at least 500 square meters in size, and no larger than 1 million square kilometers.
- `clipToLand` - clips the shape to just the portion on land, as defined by OpenStreeMap land polygons. Includes validatePolygon.
- `clipToOcean` - clips the shape to remove the portion on land, as defined by OpenStreetMap land polygons. Includes validatePolygon.
- `clipToOceanEez` - clips the shape to keep the portion within the boundary from the coastline to the outer boundary of the EEZ. Includes validatePolygon.

### Testing

Each preprocessing function has its own unit test and smoke test file. For example:

- Unit: `src/functions/validatePolygon.test.ts`
- Smoke: `src/functions/validatePolygonSmoke.test.ts`

**Unit tests** ensure the preprocessor produces exact output for very specific input features and configuration, and throws errors properly.

**Smoke tests** are about ensuring the preprocessor behaves properly for your project location, and that its results "look right" for a variety of input features. It does this by loading example shapes from the project `examples/features` directory. It then runs the preprocessing function on the examples, makes sure they produce "truthy" output, and saves them to `examples/output`.

To test your preprocessing functions, we need to create example features within the extent of our Micronesian planning area. To do this, run the following script:

```bash
npx tsx scripts/genRandomPolygon.ts --outDir examples/features --filename polygon1.json --bbox "[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]"
npx tsx scripts/genRandomPolygon.ts --outDir examples/features --filename polygon2.json --bbox "[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]"
```

This will output an example Feature and an example FeatureCollection to `examples/features`.

Now run the tests:

```bash
npm test
```

You can now look at the geojson output in `examples/output`, including visually by opening a file in QGIS or pasting it into geojson.io. This is the best way to verify the preprocessor worked as expected.

Commit the feature examples and their output files to your git repository so that you can track changes over time.

To learn more about preprocessing, check out the [guide](../preprocessing.md)

## Simple Report

Your new project comes with a simple report that calculates the area of a sketch or sketch collection. Let's look at the pieces that go into this report.

### simpleFunction

The area calculation is done within a geoprocessing function in `src/functions/simpleFunction.ts`.

Open this file and you will notice this function defines its own bespoke result payload called `SimpleResults`, in this case an object with an `area` number value.

```typescript
export interface SimpleResults {
  /** area of sketch within geography in square meters */
  area: number;
}
```

`simpleFunction` starts off with the basic signature of a geoprocessing function. It accepts a `sketch` parameter that is either a single `Sketch` polygon or a `SketchCollection` with multiple Sketch polygons. Unless your planning project only requires users to design single sketches and not collections, your geoprocessing function must be able to handle both.

```typescript
async function simpleFunction(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
): Promise<SimpleResults> {
```

The function then performs its analysis and returns the result.

```typescript
// Add analysis code
const sketchArea = area(sketch);

// Custom return type
return {
  area: sketchArea,
};
```

Below that, a new `GeoprocessingHandler` is instantiated, with simpleFunction passed into it. Behind the scenes, this wraps simpleFunction in an AWS Lambda handler function, which once deployed to AWS, allows the geoprocessing function to be invoked using an API call, by a report client running in a web browser.

```typescript
export default new GeoprocessingHandler(simpleFunction, {
  title: "simpleFunction",
  description: "Function description",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
});
```

`GeoprocessingHandler` requires a `title` and `description`, which uniquely identifies the function that will be published by your project. It also accepts some additional parameters defining what resources the Lamda should have, and its behavior:

- `timeout`: how many seconds the Lambda will run before it times out in error.
- `memory`: memory allocated to the Lambda, can go up to 10,240 MB. Number of processors increase with memory size automatically.
- `executionMode`: determines how the report client waits for your function to finish. Sync - wait with connection open, Async - wait for web socket message. Async is the best default to not tie up your browsers network connections.

You can change all these parameter values to suit your needs, but the default values are suitable for now.

`simpleFunction` is already registered as a geoprocessing function in `project/geoprocessing.json`, along with `blankFunction` which you will learn about later.

### SimpleReport

A report client is the top-level React component for creating a report and they are located in the `src/clients` directory. The report client is usually responsible for the overall report layout, rendering one or more `Pages` of `Cards` in the `src/components` directory, and setting up language translation.

- `SimpleReport.tsx` - one page report client containing a SketchAttributesCard and a SimpleCard.
- `TabReport.tsx` - more complex multi-page report layout controlled by a tab switcher component, containing a single ViabilityPage, which contains the same SimpleCard and SketchAttributesCard.

Both these report clients are already registered in `project/geoprocessing.json`. To start, let's focus on `SimpleReport.tsx` and how it invokes your `simpleFunction`.

```jsx
export const SimpleReport = () => {
  return (
    <Translator>
      <SimpleCard />
      <SketchAttributesCard autoHide />
    </Translator>
  );
};
```

SimpleReport renders two report cards, `SimpleCard` and `SketchAttributesCard`, wrapping them in a react-i18n languge `Translator` component (more on that in the next tutorial).

SketchAttributes card is a built-in report component imported from `@seasketch/geoprocessing/client-ui`. SimpleCard is a custom report component found at `src/components/SimpleCard.tsx`, which we can look at now.

```jsx
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ResultsCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
// Import SimpleResults to type-check data access in ResultsCard render function
import { SimpleResults } from "../functions/simpleFunction.js";
import { roundDecimalFormat } from "@seasketch/geoprocessing/client-core";

export const SimpleCard = () => {
  const { t } = useTranslation();
  const [{ isCollection }] = useSketchProperties();
  const titleTrans = t("SimpleCard title", "Simple Report");
  return (
    <>
      <ResultsCard title={titleTrans} functionName="simpleFunction">
        {(data: SimpleResults) => {
          const areaSqKm = data.area / 1_000_000;
          const areaString = roundDecimalFormat(areaSqKm, 0, {
            keepSmallValues: true,
          });
          const sketchStr = isCollection ? t("sketch collection") : t("sketch");

          return (
            <>
              <p>
                <Trans i18nKey="SimpleCard sketch size message">
                  This {{ sketchStr }} is {{ areaString }} square kilometers.
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};
```

The first thing to notice is that SimpleCard renders a `ResultsCard` component. Behind the scenes ResultsCard invokes `simpleFunction` and passes the results to its child render function. The child render function takes an input parameter `data` that is configured to have the same type (`SimpleResults`) as the return type of `simpleFunction`. This gives you fully typed access to your report result in the render function.

The next thing to notice is that the render function converts the calculated area value in square meters to square kilometers, rounds it to a whole number (unless it's a very small number that would round to zero), and then formats the number to make it more readable (for english adds commas for thousands). Also notice that it renders a slightly different message depending on whether it is a single sketch or a sketch collection being reported on.

This establishes the pattern of having the geoprocessing function responsible for calculating the raw values, and defining the result type interface. Value conversion and formatting details are left to be done in the report client.

The last thing to notice is that SimpleCard contains a lot of boilerplate for translating report strings to different languages using [`react-i18next`](https://react.i18next.com/). If your reports need to be multi-lingual you will need to to use them, otherwise you can drop them. Language translation is a multi-part process:

- First a combination of `useTranslation`, `t` function, and `Trans` components are used to establish which strings in your report client and components should be translated.
- Translatable strings are then extracted using the `extract:translation` command to `src/i18n/lang/en/translation.json`. The strings extacted for SimpleCard are:

```text
{
  "sketch": "sketch",
  "sketch collection": "sketch collection",
  "SimpleCard sketch size message": "This {{sketchStr}} is {{areaString}} square kilometers.",
}
```

- Once the strings are translated to different languages (covered in a later tutorial), the `Translator` component in our report client is responsible for inspecting the users language at runtime in the browser and swapping in strings for the appropriate language.

### Generate Examples

With a working geoprocessing function and report client already in place, you're ready to generate example sketches for testing them. We'll use the same `genRandomPolygon` script as before. But let's look closer at how we figured out the bounding box extent of the Micronesian planning area. First, use ogrinfo to inspect the Micronesia EEZ polygon data layer in your data package.

```bash
ogrinfo -so -json data/src/eez_withland_mr.fgb
```

Deep in its output you will see a `geometryFields` property, which contains the bounding box extent of the EEZ feature. Use the `jq` utility to extract this extent:

```bash
ogrinfo -so -json data/src/eez_withland_mr.fgb | jq -c .layers[0].geometryFields[0].extent
[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]
```

This will output an array with the extent of the EEZ. Now run the genRandomPolygon script with this extent. The following commands will create a Sketch polygon, and then a SketchCollection containing 10 Sketch polygons.

```bash
npx tsx scripts/genRandomPolygon.ts --outDir examples/sketches --filename sketch1.json --bbox "[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]" --bboxShrinkFactor 5 --sketch
npx tsx scripts/genRandomPolygon.ts --outDir examples/sketches --filename sketchCollection1.json --bbox "[135.31244183762126,-1.1731109652985907,165.67652822599732,13.445432925389298]" --bboxShrinkFactor 5 --sketch --numFeatures 10
```

The `--bboxShrinkFactor` argument used shrinks the height and width of the given bbox by a factor of 5, and then generates random features that are within that reduced bbox. A suitable shrink factor value was discovered through trial and error. Simply visualize the resulting json file in QGIS or other software and find a value that produces polygons that are completely within the planning area polygon. (see image below).

![EEZ bbox](./assets/eez-bbox.jpg)
Image: cluster of 10 random sketches (in orange) within Micronesia EEZ

Learn more about the options for `genRandomPolygon` by running:

```
npx tsx scripts/genRandomPolygon.ts --help
```

### Run test suite

Now that you have example features and sketches, you can test `simpleFunction`. Run the test suite now:

```bash
npm test
```

- Using `simpleFunctionSmoke.test.ts`, simpleFunction will be run against all of the polygon Sketches in `examples/sketches`.
- The results of all smokes tests are output to the `examples/output` directory.
- You can inspect the output files, and see the calculated area values for each sketch input.

Commit the output files to your git repository at this time.

You can make changes to simpleFunction, then rerun tests to regenerate them at any time, and delete any that are stale and no longer needed. For advanced use, check out the [testing](../Testing.md) guide.

### Storybook

Storybook is used to view your reports.

```bash
npm run storybook
```

This will:

- Generate a story for every combination of report client registered in `project/geoprocessing.json` and sketch present in `examples/sketches`.
- Load all of the smoke test output for every sketch (to load in stories instead of running geoprocessing functions)
- Start the storybook server and give you the URL.

Open the storybook URL in your browser and click through the stories.

![Storybook initial view](./assets/storybook-one.jpg)

A powerful feature of Storybook is that when you save edits to your report client or component code, storybook will refresh the browser automatically with the changes. This lets you develop your reports and debug them more quickly.

If you later add more sketch examples to the `examples/sketch` directory, will need to rerun the smoke tests to generate example output, and then stop and restart your storybook to re-generate all the stories.

Learn more in the [storybook guide](./storybook.md).

### First Project Build

Now that you have confirmed your function is working properly, and your report client displays properly for a variety of example sketches, you are ready to do your first build. A `build` of your application packages it for deployment. Specifically it:

- Checks all the Typescript code to make sure it's valid and types are used properly.
- Transpiles all Typescript to Javascript
- Bundles UI report clients into the `.build-web` directory
- Bundles geoprocessing and preprocessing functions into the `.build` directory.

To build your application run the following:

```bash
npm run build
```

Once your build is successful, you should stage and commit all your changes to git.

## Reef Report

[Work in progress past this point]

You will be creating a simple report that measures how much reef extent is captured within a Sketch or SketchCollection.

### Import Data

You will now download a data package prepared for the Federated States of Micronesia (FSM).

```bash
wget -P data/src https://github.com/user-attachments/files/17697992/FSM_MSP_Data_Example_V2.zip
unzip data/src/FSM_MSP_Data_Example_V2.zip -d data/src
rm data/src/FSM_MSP_Data_Example_V2.zip
```

Now import your first datasource.

```bash
npm run import:data
```

Reef extent - single class dataset

```text
? Type of data?
Vector
? Enter path to src file (with filename)
data/src/reefextent.fgb
? Select layer to import
reefextent
? Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename
reefextent
? Should multi-part geometries be split into single-part geometries?
Yes
? (Optional) additional formats to create (besides fgb)
[Press enter to skip]
? Select feature properties that you want to group metrics by
[Press enter to skip]
? Select additional feature properties to keep in final datasource
[Press enter to skip]
? These formats are automatically created: fgb. Select any additional formats you want created
[Press enter to skip]
? Will you be precalculating summary metrics for this datasource after import? (Typically yes if reporting sketch % overlap with datasource)
Yes
```

### Add Metric Group

A metric group defines a metric to be measured, for one or more classes of data. A `MetricGroup` record provides the information needed for a metric to be calculated (in a geoprocessing function) and to be displayed (in a report client).

Let's create your first metric group by opening `project/metrics.json`.

Choose:

- a metricId (`coralReef`)
- a type of report (`areaOverlap`)
- classes you want to show in the report (`reefExtent`) and the datasource they are sourced from (`reefextent`)
  - In this case our dataset has only one class of data, and it all comes from one datasource.

Add the following object to the end of the empty array in `project/metrics.json` and save the file.

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

### Create Report

We now have everything we need to generate our first report using the `create:report` command. This command asks you to choose one of your unused metric groups, and then it:

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

## Benthic Habitat Report

### Import Data

```bash
npm run import:data
```

```text
? Type of data?
Vector
? Enter path to src file (with filename)
data/src/benthic-rock.fgb
? Select layer to import
benthic-rock
? Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename benthic-rock
? Should multi-part geometries be split into single-part geometries?
Yes
? Select feature properties that you want to group metrics by
class
? Select additional feature properties to keep in final datasource
[Press Enter to skip]
? These formats are automatically created: fgb. Select any additional formats you want created
[Press Enter to skip]
? Will you be precalculating summary metrics for this datasource after import? (Typically yes if reporting sketch % overlap with datasource)
Yes
```

The import will proceed. Once complete you will find:

- The output file `data/dist/benthic-rock.fgb`.
- An updated `project/datasources.json` new datasource record `benthic-rock`.

If the import fails, start the import over and double check everything. It is most likely one of the following:

- You specified the wrong source file path.
- You specified the wrong layer name

### Add Metric Group

Metric group for vector data source with multiple classes

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

### Create Report

```bash
npm run create:report
```

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

Now:

- Add your new component to the Viability Page
- `npm run test`
- `npm run storybook`
- Verify report displays properly

## Octocoral Report

### Import Data

Now import the following additional datasources:

Octocorals - raster with 0/1 values representing predicted presence/absence of species.

```text
? Type of data?
Raster
? Enter path to src file (with filename)
data/src/yesson_octocorals.tif
? Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename
octocorals
? Select raster band to import
1
? What type of measurement is used for this raster data?
Quantitative - values represent amounts, measurement of single thing
? Will you be precalculating summary metrics for this datasource after import? (Typically yes if reporting sketch % overlap with datasource)
Yes
```

### Add Metric Group

### Create Report

## Advanced Features

### Add Planning Boundary

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

### Precalc Data

The `precalc` command calculates spatial statistics for the portion of each of your datasources that falls within each of your project's Geographies.

Geographies are simply geographic boundaries for your project, and the default Geography for this project is the entire World.

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

### Language Translation

Run the following to extract the latest translations from all of you report clients and its underlying components.

```bash
npm run extract:translation
```

## What's Next

You've now completed the sample tutorial. Your next step is to choose whether you would like to:

- Setup an [existing project to setup](./existingproject.md), and re-deploy it.
- Create a [create a new project](./newproject.md), deploy it and integrate with SeaSketch.

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

This tutorial will use data for the Federated States of Micronesia that has already been prepared. It is a combination of data from:

- [Marine Regions](https://marineregions.org)
- [Allen Coral Atlas](https://allencoralatlas.org/)

Learn more about accessing [third party data](./thirdparty.md)

```bash
cd data/src
wget https://github.com/user-attachments/files/17577047/FSM_MSP_Data_Example_v2.zip
unzip FSM_MSP_Data_Example_v2.zip
mv FSM_MSP_Data_Example_v2/* .
rm -rf FSM_MSP_Data_Example_v2*
```

### EEZ With Land Boundary

```bash
npm run import:data
```

```text
? Type of data? Vector
```

---

```bash
? Will you be precalculating summary metrics for this datasource after import? (Typically yes if reporting sketch % overlap with datasource) Yes
```

Respond `Yes` to allow precalculation.

---

By default mulitpolygons are split into polygons, which can save bandwidth when fetching features that overlap with a sketch.

```bash
? Should multi-part geometries be split into multiple single-part geometries? (can increase sketch overlap calc performance by reducing number of polygons
to fetch) Yes
```

Respond yes to splitting polygons.

---

```bash
? Enter path to src file (with filename) data/src/current-vector.gpkg
```

We'll import data from the `current-vector` geopackage.

---

It will now ask you for a datasource name, it should be unique, different than any other datasourceId in `projects/datasources.json`. The command won't let you press enter if it's a duplicate.

```bash
? Choose unique datasource name (use letters,numbers, -, _ to ensure will work) eez
```

Enter the datasource name `eez`.

---

A layer name must also be specified if your datasource can store multiple layers within it (geopackage). You can use the `ogrinfo` command to quickly see what layers are present in a vector dataset. If your dataset can only store one datasource such as a shapefile or a GeoJSON file, then the layer name should just be the name of the file (minus the extension). You can use the QGIS project file in the example data to view the available layers in the geopackage.

```bash
? Enter layer name, defaults to filename (eez_mr_osm)
```

The layer in this geopackage we want is called `eez_mr_osm` so enter that now.

---

If your dataset contains one or more properties that classify the vector features into one or more categories, and you want to report on those categories in your reports, then you can enter those properties now as a comma-separated list. For example a coral reef dataset containing a `type` propertie that identifies the type of coral present in each polygon. In the case of our EEZ dataset, there are no properties like this so this question is left blank.

```bash
? Enter feature property names that you want to group metrics by (
separated by a comma e.g. prop1,prop2,prop3)
```

The eez dataset has no attributes that we want to group features by so press Enter to skip this question.

---

By default, all extraneous properties will be removed from your vector dataset on import in order to make it as small as possible. Any additional properties that you want to keep in should be specified in this next question. If there are none, just leave it blank.

```bash
? Enter additional feature property names to keep in final datasource (separated by a comma e.g. prop1,prop2,prop3). All others will be filtered out
```

The eez dataset has no additional properties we want to keep so press Enter to skip this question.

---

By default, data will be imported into flatgeobuf format. Often, that's all you need. But if you want to be able to precalculate stats for this dataset, or import JSON data directly into your geoprocessing functions, or just have a human readable version of the data to verify it, then you want to include the GeoJSON format.

```bash
? The following formats will automatically be created: fgb. What additional formats would you like created? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter>
 to proceed) (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◯ json - GeoJSON
```

For the `eez` dataset, we want to precalculate state, so press spacebar to select `json` and then press the `Enter` key to proceed.

---

At this point the import will proceed and various log output will be generated. Once complete you will find:

- The output file `data/dist/eez.fgb`.
- An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `eez`. You'll see all the answers to your questions.

If the import fails, try again double checking everything. It is most likely one of the following:

- You specified the wrong source file path.
- You specified the wrong layer name

You can now make edits to datasource.json at any time and then run `reimport:data` to regenerate the files in `data/dist`.

### Import vector datasource

Vector datasets can be any format supported by [GDAL](https://gdal.org/drivers/vector/index.html) "out of the box". Common formats include:

- GeoJSON
- GeoPackage
- Shapefile
- File Geodatabase

Importing a vector dataset into your project will:

- Reproject the dataset to the WGS84 spherical coordinate system, aka EPSG:4326.
- Transform the dataset into one or more formats including the [flatgeobuf](https://flatgeobuf.org/) cloud-optimized format and GeoJSON
- Strip out any unnecessary feature properties (to reduce file size)
- Optionally, expand multi-part geometries into single part
- Calculates overall statistics including total area, and area by group property
- Output the result to the `data/dist` directory, ready for testing
- Add datasource to `project/datasource.json`

Start the import process and it will ask you a series of questions, press Enter after each one, and look to see if a default answer is provided that is sufficient:

```bash
npm run import:data
? Type of data? Vector
```

Now import the `reefextent` vector data from the geopackage.

```bash
? Enter path to src file (with filename) data/src/reefextent.gpkg
```

Select the name of the vector layer you want to import. The example reef extent data named `Micronesian Exclusive Economic Zone` in `reefextent.gpkg`

```bash
? Select layer to import Micronesian Exclusive Economic Zone
```

Choose a datasource name that is different than any other datasourceId in `projects/datasources.json`. The command won't let you press enter if it's a duplicate.

```bash
? Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename reefextent
```

If your dataset contains one or more properties that classify the vector features into one or more categories, and you want to report on those categories in your reports, then you can enter those properties now as a comma-separated list. For example a coral reef dataset containing a `type` property that identifies the type of coral present in each polygon. In the case of our EEZ dataset, there are no properties like this so press Enter to continue without.

```bash
? Select feature properties that you want to group metrics by (Press <space> to select, <a> to toggle all, <i> to invert selection)
```

By default, all extraneous properties will be removed from your vector dataset on import in order to make it as small as possible. Any additional properties that you want to keep in should be specified in this next question. If there are none, just press Enter.

```bash
? Select additional feature properties to keep in final datasource (Press <space> to select, <a> to toggle all, <i> to invert selection)
```

Mulitpolygons can be split into polygons for analysis, which can help report performance.

```bash
? Should multi-part geometries be split into multiple single-part geometries? (can increase sketch overlap calc performance by reducing number of polygons
to fetch) Yes
```

Typically you only need to published Flatgeobuf data, which is cloud-optimized so that geoprocessing functions can fetch features for just the window of data they need (such as the bounding box of a sketch). Flatgeobuf is automatically created. GeoJSON is also available if you want to be able to import data directly in your geoprocessing function typescript files, or inspect the data using a human readable format. Just press enter if you are happy with the default.

```bash
? Select additional formats to publish (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◯ json - GeoJSON
```

If you want to use your data in analytics, respond `Yes` to allow precalculation.

```bash
? Will you be precalculating summary metrics for this datasource after import? (Typically yes if reporting sketch % overlap with datasource) Yes
```

At this point the import will proceed and various log output will be generated. Once complete you will find:

- The output file `data/dist/reefextent.fgb` and possibly `data/dist/reefextent.json` if you chose to generate it.
- An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `reefextent`

Vist `datasources.json` and check out your new datasource entry. Using the example data, the datasource entry should looks as follows:

```json
{
  "src": "data/src/reefextent.gpkg",
  "layerName": "Micronesian Exclusive Economic Zone",
  "geo_type": "vector",
  "datasourceId": "reefextent",
  "formats": ["fgb"],
  "classKeys": [],
  "created": "2024-02-29T22:54:16.140Z",
  "lastUpdated": "2024-02-29T22:54:16.140Z",
  "propertiesToKeep": [],
  "explodeMulti": true,
  "precalc": true
}
```

If the import fails, try again double checking everything. It is most likely one of the following:

- You aren't running Docker Desktop (required for running GDAL commands)
- You provided a source file path that doesn't point to a valid dataset
- You aren't using a file format supported by GDAL
- The layer name or property names you entered are invalid

#### Vector data with key parameter

What if you have a vector file with multiple classes you want to group metrics by? The other example data `benthic.gpkg` separates different benthic habitats (Sand, Seagrass, Coral) by a `class` parameter. The import for this datasource looks as follows:

```bash
npm run import:data -> Vector -> data/src/benthic.gpkg -> Micronesian Exclusive Economic Zone -> benthic -> class -> {none} -> Yes -> {none} -> Yes
```

The resulting `datasource.json` entry will look as follows:

```json
{
  "src": "data/src/benthic.gpkg",
  "layerName": "Micronesian Exclusive Economic Zone",
  "geo_type": "vector",
  "datasourceId": "benthic",
  "formats": ["fgb"],
  "classKeys": ["class"],
  "created": "2024-02-29T21:47:44.858Z",
  "lastUpdated": "2024-02-29T21:47:44.858Z",
  "propertiesToKeep": ["class"],
  "explodeMulti": true,
  "precalc": true
}
```

### Import raster datasource

Raster datasets can be any format supported by [GDAL](https://gdal.org/drivers/raster/index.html) "out of the box". Common formats include:

- GeoTIFF

Importing a raster dataset into your project will:

- Reproject the data to an equal area projection called WGS 84 / NSIDC EASE-Grid 2.0 Global, aka EPSG:6933.
- Extract a single band of data
- Transform the raster into a [cloud-optimized GeoTIFF](https://www.cogeo.org/)
- Calculates overall statistics including total count and if categorical raster, a count per category
- Output the result to the `data/dist` directory, ready for testing
- Add datasource to `project/datasource.json`

Start the import process and it will ask you a series of questions, press Enter after each one, and look to see if a default answer is provided that is sufficient:

```bash
npm run import:data
? Type of data? Raster
```

Assuming you are using the [FSM example data](#link-project-data) package and it is accessible via the `data/src` directory (using [data link option 2 or 3](#link-project-data)). Let's import the `yesson_octocorals` raster which is a `binary` raster containing cells with value 1 where octocorals are predicted to be present, and value 0 otherwise.

```bash
? Enter path to src file (with filename) data/src/yesson_octocorals.tif
```

Choose a datasource name that is different than any other datasourceId in `projects/datasources.json`. The command won't let you press enter if it's a duplicate.

```bash
? Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename octocorals
```

If the raster has more than one band of data, select the band you want to import.

```bash
? Enter band number to import 1
```

Choose what the raster data represents. The octocorals raster is a binary 0/1 raster representing absence or presence, so choose Quantitative.

`Quantitative` - measures one thing. This could be a binary 0 or 1 value thatidentifies the presence or absence of something, or a value that varies over the geographic surface such as temperature.
`Categorical` - measures presence/absence of multiple groups. The value of each cell in the band is a numeric group identifier, and thus each cell can represent one and only one group at a time.

```bash
❯ Quantitative - values represent amounts, measurement of single thing
  Categorical - values represent groups
```

It will then ask you if there is a nodata value for this raster. QGIS or the gdalinfo command can tell you this. For octocorals, there is no nodata value so just hit Enter.

```bash
? Enter nodata value for raster or leave blank
```

At this point the import will proceed and various log output will be generated.

Do not be concerned about an error that an ".ovr" file could not be found. This is expected. Once complete you will find:

- The output file `data/dist/octocorals.tif`
- An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `octocorals`.

If the import fails, try again double checking everything. It is most likely one of the following:

- You aren't running Docker Desktop (required for running GDAL commands)
- You provided a source file path that doesn't point to a valid dataset
- You aren't using a file format supported by GDAL

## Precalc Data

Once you have geographies and datasources configured, you can precalculate metrics for them.

```bash
npm run precalc:data
```

To avoid precalculating data you don't require, when asked if you wish to precalcate specific metrics, select `Yes, by datasource` and then select `global-eez-mr-v12` (used in the provided Size report) and your imported datasource (in this tutorial: `reefextent`).

Precalc will start a web server on localhost port 8001 that serves up data from `data/dist` access by this command.

You need to have at least one geography in geographies.json and one datasource in datasources.json with the `precalc` property set to true. The command will measure (total area, feature count, value sum) the portion of a datasources features that fall within the geography (intersection).

These overall metric values are used almost exclusively for calculating % sketch overlap, they provide the denominator value. For example, if you have a geography representing the EEZ of a country, and you have a sketch polygon, and you have a datasource representing presence of seagrass. And you want to know the percentage of seagrass that is within the sketch, relative to how much seagrass is in the whole EEZ boundary.

`seagrass sketch % = seagrass area within sketch / seagrass area within EEZ`

We can and often need to precalculate that denominator for all possible geographies. That is what the `precalc:data` command does, it precalculates a set of metrics for all datasources against all geographies, where the `precalc` property is set to true in both the datasource and the geography.

Precalc metrics are then imported into a report client, and combined with the sketch overlap metrics returned from the geoprocessing function, to produce a percentage.

Tips for precalculation:

- You have to re-run `precalc:data` every time you change a geography or datasource.
- Set `precalc:false` for datasources that are not currently used, or are only used to define a geography (not displayed in reports). This is why the datasource for the default geography for a project is always set by default to `precalc: false`.
- If you are using one of the [global-datasources](https://github.com/seasketch/global-datasources) in your project, and you want to use it in reporting % sketch overlap, so you've set `precalc:true`, strongly consider defining a `bboxFilter`. This will ensure that precalc doesn't have to fetch the entire datasource when precalculating a metric, which can be over 1 Gigabyte in size. Also consider setting a `propertyFilter` to narrow down to just the features you need. This filter is applied on the client-side so it won't reduce the number of features you are sending over the wire.

### Precalc Data Cleanup

If you remove a geography/datasource, then in order to remove their precalculated metrics from `precalc.json`, you will need to run the cleanup command.

```bash
npm run precalc:data:cleanup
```

## Create Metric Group

The metric group is your report configuration. There is one metric group per individual report. It links everything together and defines what data you want to show in the individual report. The metric group is used in both the function that calculates statistics and the component which displays the results. Often, projects will include ~8 reports, with each report focusing on a goal or type of data.

Navigate to `metrics.json`, where metric groups are stored. There is already a report here – `boundaryAreaOverlap`. This is the metric group used to calculate how much of the EEZ is within our sketch, using the `global-eez-mr-v12` datasource we [precalculated](#precalc-data).

We’re going to create a report that uses the vector layer just imported. We want to see how much our sketch overlaps with the vector layer. Pick a metricId to be the title of your report in camelCase (`coralReef`), the type of report (`areaOverlap`), and the classes you want to show in the report. Your classes can look a myriad of ways, depending on whether all the data is from a single file, or multiple files. All data within a metric group must be in the same format (raster or vector).

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

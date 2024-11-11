# Create New Geoprocessing Project

This tutorial walks you through creating your own project and some of the decisions you'll face along the way.

This tutorial assumes:

- Your [system setup](./Tutorials.md) is complete
- You completed the [sample project tutorial](./sampleproject.md)
- Your geoprocessing virtual environment is running (Devcontainer or WSL)
- You have VSCode open in your virtual environment with a terminal pane open

Have questions along the way? [Start a discussion](https://github.com/seasketch/geoprocessing/discussions) on Github.

## How Do I Design It?

Creating a geoprocessing project is rarely linear, especially your first time. It's iterative. Don't worry if you don't have all the answers or understand all the features of the framework. Here's one approach:

- Start with a rough design. Consider this [template](https://docs.google.com/document/d/1Qe7pZYmwg7ggRY9ocu3tpdTQkvuIHMr38wLxrjSitpU/edit?usp=sharing)
- Explore the [UI component library](/storybook)
- Look at reports in other SeaSketch projects.
- Start simple - one report section, one metric
  - create a SeaSketch project
  - initialize a geoprocessing project
  - link your data into project workspace
  - import a datasource
  - write a geoprocessing function
  - export example polygons and run smoke tests
  - write report client using storybook
  - build and deploy to AWS
  - connect your seasketch project
  - draw sketch and run report
- Iterate. - add more features
  - preprocessing function
    Geographies and MetricGroups.
- As you hit new walls, look at your options to overcome.

## How Do I Build It?

The geoprocessing framework is a set of building blocks. It's up to you to figure out which you need and how to put them together.

If your planning process is simple:

- one or no planning area
- no concern about overlapping sketches
- smaller datasets with no precalculation needed
- short running analysis
- no classification of protection levels
- straightforward objectives with no targets
- Limited number of dimensions to each objective
- english only language

Then your geoprocessing project can be kept simple. A good example of this is [Oregon](https://github.com/underbluewaters/oregon-next) project reports.

- no precalculation needed
- manual prep and publish of datasources to S3, or even direct import of GeoJSON files in geoprocessing functions.
- simple metrics calculated directly using libraries Turf and Geoblaze
- simple reports rendering a few values, a table, a chart

As your planning process gets more complex:

- multiple planning areas (offshore/nearshore)
- even more boundary types used for assessing (e.g. bioregions)
- planning area crossing the 180 degree antimeridian
- classification system with protection levels
- enforcing rules about overlapping sketches
- large datasets with multiple subclasses of data requiring pre-calculation.
- long running analysis
- multiple levels of objectives with targets
- large number of dimensions to metrics
- multiple languages

Then your geoprocessing project becomes more complex, and there are some higher level features to make this more manageable:

- `data:import` and `data:publish` commands automating transform and publish of cloud-optimized formats to S3
- `Geography` records representing project planning boundaries and utilities like `clipToGeography`
- `precalc` command auto-calculating overlay stats for all combinations of Datasources and Geographies ahead of time.
- `Metric` data type for representing multi-dimensional data.
- `MetricGroup` records representing all project metrics and their data classes, datasources, objectives with targets, etc.
- `rasterMetrics` and `overlapFeatures` analysis modules supporting Geographies and Metrics, with built-in support for SketchCollections and handling of sketch overlap.
- `worker` functions to spread processing across more Lambdas to run in parallel.
- library of UI building blocks that understand `MetricGroups` and `Metrics` and are pre-translated in all languages.
- `translation` workflow using third-party POEditor service.

Examples of more complex projects:

- [California](https://github.com/seasketch/california-reports) - multiple planning geographies, worker functions
- [Bermuda](https://github.com/seasketch/bermuda-reports-next) - IUCN classification system with metrics calculated overall, per protection level, and per sketch. worker functions
- [Blue Azores nearshore](https://github.com/seasketch/azores-nearshore-reports) - user switching between planning geographies.
- [Samoa Reports](https://github.com/seasketch/samoa-reports)
- [Azores Nearshore Reports](https://github.com/seasketch/azores-nearshore-reports).

## Create SeaSketch Project

First, follow the [instructions](https://docs.seasketch.org/seasketch-documentation/administrators-guide/getting-started) to create a new SeaSketch project. This includes defining the planning bounds and [creating a Sketch class](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes). You will want to create a `Polygon` sketch class with a name that makes sense for you project (e.g. MPA for Marine Protected Area) and then also a `Collection` sketch class to group instances of your polygon sketch class into. Note that sketch classes are where you will integrate your geoprocessing services to view reports, but you will not do it at this time.

## Initialize New Project

Start with initializing a new project:

```sh
cd /workspaces
npx @seasketch/geoprocessing@7.0.0-experimental-7x-simplify.44 init 7.0.0-experimental-7x-simplify.44
```

Tips:

- the answers to all of the init questions can be changed later, so don't worry if you don't know the answer.
- [SeaSketch](https://github.com/seasketch/next/blob/master/LICENSE) uses a BSD-3 license (the default choice). You can choose any including `UNLICENSED` meaning proprietary or "All rights reserved" .
- The most common AWS region is `us-west-1` or `us-east-2`. [Choose the region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) closest to your project.

Learn more about your projects [structure](../structure.md)

## Link Data Into Workspace

Choose how to [bring data into your workspace](../linkData.md).

## Import Datasources

Methods:

- Use `import:data`
- Manually prepare and copy your data to datasets bucket

## Write a Geoprocessing Function

Let's start with `src/functions/simpleFunction` and build it up to use a datasource.

Methods:

- Directly import geojson file in function
- Use `datasource` record and `getDatasource` and `getFeatures`
- Load from local bucket using `load` function, url, and bbox
- Load from third-party using `load` function, url, and bbox

If the data you'll use in analysis is already published online, publicly accessible, and in flatgeobuf or cloud-optimized geotiff format, then you can directly access them.

## Smoke Test With Examples

Methods to generate examples:

- genRandomPolygon
- geojson.io
- export sketch geojson from SeaSketch project

Assuming you have a SeaSketch project with a Polygon sketch class, follow the instructions for [sketching tools](https://docs.seasketch.org/seasketch-documentation/users-guide/sketching-tools) to draw one or more polygon sketches. You can also create a collection and group your sketches into the collection.

Finally, [export](https://docs.seasketch.org/seasketch-documentation/users-guide/sketching-tools#downloading-sketches) your sketches and sketch collections as GeoJSON, and move them into your geoprocessing projects `examples/sketches` folder.

```bash
  /examples/
    sketches/ # <-- examples used by geoprocessing functions
    features/ # <-- examples used by preprocessing functions
```

Once you add your example sketches and collections to this folder, run your smoke tests.

```bash
npm run test
```

The smoke test for your geoprocessing function will run the function against every sketch example whether a single Sketch or a SketchCollection and output the results to `examples/output`. You look at this output and ensure that it is as expected.

Learn more about testing and debugging in
[testing](../Testing.md)

## Write Report Client

## Build and Deploy to AWS

[Deploy your project](deploy.md)

### Debugging build failure

If the build step fails, you will need to look at the error message and figure out what you need to do. Did it fail in building the functions or the clients? 99% of the time you should be able to catch these errors sooner. If VSCode finds invalid Typescript code, it will warn you with files marked in `red` in the Explorer panel or with red markes and squiggle text in any of the files.

If you're still not sure try some of the following:

- Run your smoke tests, see if they pass
- When was the last time your build did succeed? You can be sure the error is caused by a change you made since then either in your project code, by upgrading your geoprocessing library version and not migratin fully, or by changing something on your system.
- You can stash your current changes or commit them to a branch so they are not lost. Then sequentially check out previous commits of the code until you find one that builds properly. Now you know that the next commit cause the build error.

## Connect to SeaSketch Project and Test

Choose `clipToOcean` as preprocessor
Choose `MpaTabReport` as report client

Test different sketch and collection scenarios. When you find one that errors or does something unexpected, then you can export that sketch to your projects `examples/sketches` directory and run your smoke tests. If that succeeds and produces output as expected, then load your storybook and see if you can reproduce in your report client.

## Use Advanced Features

These features you should only use if you need them.

## Project Client

It has a lot of shortcut methods for working with datsources, geographies, precalc metrics, objectives, etc. It's not meant to be a black box, you can look at what it does.

[Link to project client ]

## Configure Geography

### Precalc Metrics

At the very least you should import your planning boundaries, preferably as individual files, or as individual layers within a file package.

Any file-based format that OGR and GDAL supports out of the box.

```sh
npm run precalc:data

? Do you want to precalculate only a subset?
  Yes, by datasource
  Yes, by geography
  Yes, by both
❯ No, just precalculate everything (may take a while)
```

What's happening is that the precalc script starts a local web server on port 8001 that serves up the datasources in `data/dist`.

The precalc script then gets all your project datasources with `precalc: true`, and all your project geographies with `precalc: true`, and then calculate `area`, `sum`, and `count` metrics for each combination of datasource and geography.

Once complete `project/precalc.json` will have been updated with the new metric values.

If your datasource has `classKeys` defined in its record, precalc will also calculate `area`, `sum`, and `count` for each unique class value found within the classKey.

You must re-run `precalc:data` every time you change a geography record or a datasource.

- To learn more advanced use, see the [precalc](../precalc.md) guide.
- To learn more about use of precalculated metrics, see the [report client](../reportclient.md) guide.

## Metric Groups

How you intend to use your data will determine what form the data needs to be in.

### Examples By Use Case

- Do you have vector data?
  - Does it have a single data class?
    - Is it one file with one data class?
    - Is it one file with multi-class attribute, of which you only need one?
      - create a new dataset with
  - Does it have multiple data classes?
    - Is it one data class per file?
    - I sit one data class per layer within file?
    - Does it have multiple data classes within one layer with an attribute to differentiate them?
- Do you have raster data?
  - Does it have a single data class?
    - Is it one file with one data class?
  - Does it have multiple data classes?
    - Is it one file, one data class per raster band?
    - Is it multiple files, one data class per file?
    - Is it a categorical raster with unique cell value for each class?

[ToDo: provide metric group example for each leaf in tree]

### Create Report

- Edits to the statistic you want calculated (i.e.calculating average instead of sum, etc) should happen in your function (`src/functions/benthicHabitat.ts`).
- Edits to the way the analytics are displayed (i.e. changing labels, converting units, adding text context, etc) should happen in your component (`src/components/BenthicHabitat.tsx`).

## Language Translation

Language translation takes effort to maintain. It is suggested that you get your reports close to final, in the English language, and then [add translations](../gip/GIP-1-i18n.md#language-translation-tutorial).

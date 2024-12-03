[WORK IN PROGRESS]

# Create New Geoprocessing Project

This tutorial walks you through designing and creating your own geoprocessing report. It covers many of the questions and decisions you might face along the way.

This tutorial assumes:

- Your [system setup](./Tutorials.md) is complete
- You completed the [sample project tutorial](./sampleproject.md)
- Your geoprocessing virtual environment is currently running (Devcontainer or WSL)
- You have VSCode open in your virtual environment with a terminal pane open

## Where Do I Start?

Creating a geoprocessing project is not linear, it's iterative. You don't need to have all the answers for your project or understand all the features of the framework. Here's one approach:

### Design

- Explore the geoprocessing [UI component library](/storybook)
- Look at other SeaSketch Reports
- Use a design [template](https://docs.google.com/document/d/1Qe7pZYmwg7ggRY9ocu3tpdTQkvuIHMr38wLxrjSitpU/edit?usp=sharing). This one asks common questions and is a good place to capture decisions.

### Start Simple

The geoprocessing framework is a set of building blocks. Which ones you use are up to you. If your planning process requirements can start simple:

- a single planning boundary or none at all
- simple measurable objectives (overlap area, % area overlap, overlap feature count)
- on smaller datasets
- no classification of sketch types (e.g. protection levels)
- no need to handle overlapping sketch polygons

Then your geoprocessing project code can start simple:

- no precalculation needed
- direct import of GeoJSON datasets in code, or simple datasource import.
- direct use of turf and geoblaze to calculate simple metrics
- simple reports rendering a few values, a table, a chart

A good example of this is [Oregon](https://github.com/underbluewaters/oregon-next) SeaSketch reports.

### Then Get Complicated

As your planning process gets more complex:

- multiple planning boundaries (offshore/nearshore)
- multiple objectives with targets
- large datasets with multiple data subclasses.
- long running analysis with required precalculation
- use of a sketch classification system (e.g. protection levels)
- need to enforce rules about overlapping sketches

Then your project can benefit from more advanced features:

- Fully managed `Datasources` via `data:import` and `data:publish` commands with automated import, transform, and publish to S3.
- `Geography` records representing project planning boundaries
- `Metric` records for representing multi-dimensional analysis results.
- `Objective` records representing objective targets per sketch class.
- `MetricGroup` records reresenting relationship of metric results to their data classes, datasource, objective target, etc.
- `toolbox` for calculating overlay analysis metrics at the collection level in many dimensions - by data class, by protection level, by planning boundary.
  - `overlapFeatures`, `rasterMetrics`, `overlapFeaturesGroupMetrics`, `overlapRasterGroupMetrics`
- UI components that can work with all of these record types
  - `ClassTable`, `SketchClassTable`, `GeographySwitcher`, `RbcsMpaObjective`
- `precalc` command automating pre-calculation of overlay stats for combinations of Datasources and Geographies.
- `worker` functions to run geoprocessing work in parallel and get results faster.
- Language `translation` workflow and library of pre-translated UI components.

Examples of more complex projects:

- [California](https://github.com/seasketch/california-reports) - multiple geographies presented in reports (planning boundaries, bioregions), worker functions
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
npx @seasketch/geoprocessing@7.0.0-experimental-7x-docs.124 init 7.0.0-experimental-7x-docs.124
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
- Script your own method to prepare data and put it into `data/dist`

## Write a Geoprocessing Function

Let's start with `src/functions/simpleFunction` and build it up to use a datasource.

Methods:

- Directly import geojson file in function
- Use `datasource` record and `getDatasource` and `getFeatures`
- Load from project datasets bucket using `loadFgb` or `loadCog` function
- Load from third-party using `loadFgb` or `loadCog` function

If the data you'll use in analysis is already published online, publicly accessible, and in flatgeobuf or cloud-optimized geotiff format, then you can directly access them with `loadFgb` and `loadCog` functions.

## Testing

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

## Publish Datasources

Methods:

- use `publish:data`
- script your own method to publish datasources from `data/dist` to project `datasets` S3 bucket.

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

## Advanced Features

There are more advanced features available if you need them.

### Project Client

It has a lot of shortcut methods for working with datasources, geographies, precalc metrics, objectives, etc.

[Link to project client ]

### Configure Geography

Import planning boundary datasource and add as geography

#### Precalc Metrics

At the very least you should import your planning boundaries, preferably as individual files, or as individual layers within a file package.

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

### Metric Groups

How you intend to use your data will determine what form the data needs to be in.

- Do you have a vector dataset?
  - Does it have a single data class?
  - Does it have multiple data classes?
    - Is it one data class per file?
    - Is it one data class per layer within file?
    - Does it have multiple data classes within one layer with an attribute to differentiate them?
- Do you have raster dataset?
  - Does it have a single data class?
    - Is it one file with one data class?
  - Does it have multiple data classes?
    - Is it one file, one data class per raster band?
    - Is it multiple files, one data class per file?
    - Is it a categorical raster with unique cell value for each class?

[ToDo: provide metric group example for each leaf in tree]

### Create Report

- Edits to the statistic you want calculated (i.e.calculating average instead of sum, etc) should happen in your function.
- Edits to the way the analytics are displayed (i.e. changing labels, converting units, adding text context, etc) should happen in your report components.

### Language Translation

Language translation takes effort to maintain. It is suggested that you get your reports close to final, in the English language, and then [add translations](../gip/GIP-1-i18n.md#language-translation-tutorial).

## What Next

Still have more questions? [Start a discussion](https://github.com/seasketch/geoprocessing/discussions) on Github.

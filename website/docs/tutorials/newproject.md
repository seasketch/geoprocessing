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

- Put together a rough design [template](https://docs.google.com/document/d/1Qe7pZYmwg7ggRY9ocu3tpdTQkvuIHMr38wLxrjSitpU/edit?usp=sharing). This one asks common questions and is a good place to capture decisions.
- Explore the geoprocessing [UI components library](/storybook).
- Look at other SeaSketch Reports and find ideas that match your needs.

### Start Simple

If it's not clear at this point, the geoprocessing framework is not a one-side-fits-all solution, it's a set of building blocks. Which ones you use are up to you.

It takes time to figure out how it all works so keep it simple to start:

- single planning boundary or none at all
- simple measurable objectives (overlap area, % area overlap, overlap feature count)
- smaller datasets
- no groupno classification of sketch types (e.g. protection levels)
- no need to handle overlapping sketch polygons

A good example of this is [Oregon](https://github.com/underbluewaters/oregon-next) SeaSketch reports.

Then as your planning process gets more complex:

- multiple planning boundaries (offshore/nearshore)
- multiple objectives with targets
- large datasets with multiple data subclasses.
- long running analysis with required precalculation
- use of a sketch classification system (e.g. protection levels)
- need to enforce rules about overlapping sketches

Your project can benefit from more advanced features:

- `Geography` records representing project planning boundaries
- `Metric` records for representing multi-dimensional analysis results.
- `Objective` records representing objective targets per sketch class.
- `MetricGroup` records reresenting relationship of metric results to their data classes, datasource, objective target, etc.
- `toolbox` for calculating overlay analysis metrics at the collection level in many dimensions - by data class, by protection level, by planning boundary.
  - `overlapFeatures`, `rasterMetrics`, `overlapFeaturesGroupMetrics`, `overlapRasterGroupMetrics`
- UI components that can work multi-dimensional metrics
  - `ClassTable`, `SketchClassTable`, `GeographySwitcher`
- `precalc` command automating pre-calculation of overlay stats for combinations of Datasources and Geographies.
- `worker` functions to run spread out geoprocessing work to run in parallel.
- Language `translation` workflow and library of pre-translated UI components.

Examples of more complex projects:

- [California](https://github.com/seasketch/california-reports) - multiple geographies presented in reports (planning boundaries, bioregions), worker functions
- [Bermuda](https://github.com/seasketch/bermuda-reports-next) - IUCN classification system with metrics calculated overall, per protection level, and per sketch. worker functions
- [Blue Azores nearshore](https://github.com/seasketch/azores-nearshore-reports) - user switching between planning geographies.
- [Samoa Reports](https://github.com/seasketch/samoa-reports)
- [Azores Nearshore Reports](https://github.com/seasketch/azores-nearshore-reports).

## Create A SeaSketch Project

First things first, follow the [instructions](https://docs.seasketch.org/seasketch-documentation/administrators-guide/getting-started) to create a new SeaSketch project. This includes defining the planning bounds and [creating a Sketch class](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes). You will want to create a `Polygon` sketch class with a name that makes sense for you project (e.g. MPA for Marine Protected Area) and then also a `Collection` sketch class to group instances of your polygon sketch class into. Note that sketch classes are where you will integrate your geoprocessing services to view reports, but you will not do it at this time.

## Initialize New Geoprocessing Project

Start with initializing a new project:

```sh
cd /workspaces
npx @seasketch/geoprocessing@7.0.0-experimental-7x-docs.132 init 7.0.0-experimental-7x-docs.132
```

Tips:

- the answers to all of the init questions can be changed later, so don't worry if you don't know the answer.
- [SeaSketch](https://github.com/seasketch/next/blob/master/LICENSE) uses a BSD-3 license (the default choice). You can choose any including `UNLICENSED` meaning proprietary or "All rights reserved" .
- The most common AWS region is `us-west-1` or `us-east-2`. [Choose the region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) closest to your project.

Learn more about your projects [structure](../structure.md)

- [Create Github repo and push](./sampleproject.md#create-git-repo)
- [Link data into workspace](../linkData.md)

## Create Your First Report

- [Low-level vector report](./sampleproject.md#reef-report)
- [High-level vector report](./sampleproject.md#benthic-habitat-report)
- [Low-level raster report](./sampleproject.md#seamount-report)
- [High-level raster report](./sampleproject.md#coral-species-report)

## Build Your Project

The application `build` proceess packages it for deployment. Specifically it:

- Checks all the Typescript code to make sure it's valid and types are used properly.
- Transpiles all Typescript to Javascript
- Bundles UI report clients into the `.build-web` directory
- Bundles geoprocessing and preprocessing functions into the `.build` directory.

To build your application run the following:

```bash
npm run build
```

If the build step fails, you will need to look at the error message and figure out what you need to do. Did it fail in building the functions or the clients? 99% of the time you should be able to catch these errors sooner. If VSCode finds invalid Typescript code, it will warn you with files marked in `red` in the Explorer panel or with red markes and squiggle text in any of the files.

If you're still not sure try some of the following:

- Run your smoke tests, see if they pass
- When was the last time your build did succeed? You can be sure the error is caused by a change you made since then either in your project code, by upgrading your geoprocessing library version and not migratin fully, or by changing something on your system.
- You can stash your current changes or commit them to a branch so they are not lost. Then sequentially check out previous commits of the code until you find one that builds properly. Now you know that the next commit cause the build error.

## Deploy Project To AWS

[Deploy your project](deploy.md)

- Setup AWSCLI
- Deploy to AWS

## Publish Datasources

Once you have deployed your project to AWS, it will have an S3 bucket just for publishing `datasources`. The name of this bucket is based on the name of your project. If your project is named `my-project` (the name assigned in your package.json file), then the bucket name will be:

```
s3://gp-my-project-datasets
```

To pubish your data run the following command:

```bash
npm run publish:data
```

It will ask you if you want to publish all datasources, or choose from a list.

Your datasources will need to have already been imported using `import:data` and exist in the `data/dist` for this to work.

Note if you don't publish your datasources, then your local smoke tests may work properly, but your geoprocessing functions will throw file not found errors in production.

## Integrate With SeaSketch

Once you've deployed your project, you will find a file called `cdk.outputs` which contains the URL to the service manifest for your project.

```json
"restApiUrl": "https://xxxyyyyzzz.execute-api.us-west-2.amazonaws.com/prod/",
```

Now follow the [SeaSketch instructions](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes) to assign services to each of your sketch classes.

If your sketch class is a Polygon or other feature type, you should assign it both a preprocessing function (for clipping) and a report client. If you installed the `template-ocean-eez` starter template then your preprocessor is called `clipToOceanEez` and report client is named `MpaTabReport`.

If your sketch class is a collection then you only need to assign it a report client. Since we build report clients that work on both individual sketches and sketch collections, you can assign the same report client to your collection as you assigned to your individual sketch class(es).

This should give you the sense that you can create different report clients for different sketch classes within the same project. Or even make reports for sketch collections completely different from reports for individual sketches.

Create a sketch and run your reports to make sure it all works!

## Build Up Your Tests

Test different sketch and collection scenarios. Here's some possibilities:

- draw a sketch that covers the entire planning area
- draw a tiny sketch
- draw two sketches that overlap and put them in a collection. Make sure overlap is handled properly in reports.

When you find a sketch that produces an error in your reports in SeaSketch, in most cases you should be able to reproduce it in your local environment. To do this, export the sketch as a GeoJSON file, and put it in your `examples/sketches` directory and run your smoke tests. If the geoprocessing functions all succeed, then load storybook and see if you can produce an error in the browser.

## Additional Guides

- [Create a custom preprocessing function](../preprocessing.md)
- [Learn more about geoprocessing functions](../geoprocessing.md)
- [Setup language translation (i18n)](../gip/GIP-1-i18n.md#language-translation-tutorial)
  - Language translation takes effort to maintain. It is suggested that you get your reports close to final, in the English language, and then dig in.
- [Worker Functions](../workers.md)
- [Custom Sketch Attributes](./sketchAttributes.md)
- [Extra Function Parameters](./extraParams.md)
- [Multi-Boundary](../multiBoundary/multiBoundary.md)
- [Antimeridian](../antimeridian/Antimeridian.md)

## What Next

Still have more questions? [Start a discussion](https://github.com/seasketch/geoprocessing/discussions) on Github.

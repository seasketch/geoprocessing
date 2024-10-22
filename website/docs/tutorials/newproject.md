# Create a New Geoprocessing Project

Assuming [initial system setup](#initial-system-setup) is complete.

This tutorial now walks through generating a new geoprocessing project codebase and committing it to Github.

## Create Github Repository

First, we'll establish a remote place to store your code.

- [Create a new Github repository](https://github.com/new) called `fsm-reports-test` (you can pick your own name but the tutorial will assume this name). When creating, do not initialize this repository with any files like a README.
- In your VSCode terminal, make sure you are in your projects top-level directory. A shorthand way to do this is `cd ~/src/fsm-reports-test`.

## Connect Git Repo

Now enter the following commands to establish your project as a git repository, connect it to your Github repository you created as a remote called "origin", and finally push your code up to origin.

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/PUT_YOUR_GITHUB_ORG_OR_USERNAME_HERE/fsm-reports-test.git
git push -u origin main
```

It may ask you if it can use the Github extension to sign you in using Github. It will open a browser tab and communicate with the Github website. If you are already logged in there, then it should be done quickly, otherwise it may have you log-in to Github.

You should eventually see your code commit proceed in the VSCode terminal. You can then browse to your Github repository and see that your first commit is present at https://github.com/[YOUR_GITHUB_ORG_OR_USERNAME]/foo-reports

After this point, you can continue using git commands right in the terminal to stage code changes and commit them, or you can use VSCode's [built-in git support](https://code.visualstudio.com/docs/sourcecontrol/overview).

### If running devcontainer (Install Option 1)

- Ensure your VSCode workspace is connected to your devcontainer
- You can now create as many geoprocessing projects as you want under `/workspaces` and they will persist as long as the associated docker volume is maintained. Each project you create should be backed by a Github repository which you should regularly commit your code to in order to ensure it's not lost.

To get started:

- Open a terminal with Ctrl-J if not already open
- `cd /workspaces`

### If Running MacOS Bare Metal / Windows WSL (Install Option 2)

Windows:

- Open start menu -> `Ubuntu on Windows`
  - This will start a bash shell in your Ubuntu Linux home directory
- Create a directory to put your source code
  - `mkdir -d src`
- Start VSCode in the Ubuntu terminal
  - `code .`
  - This will install a vscode-server package that bridges your Windows and Ubuntu Linux environments so that VSCode will run in Windows and connect with your source code living in your Ubuntu Linux project directory.
- Open a terminal in VSCode with `Ctrl-J` in Windows or by clicking Terminal -> New Terminal.
  - The current directory of the terminal should be your project folder.

MacOS:

- Open Finder -> Applications -> VSCode
- Open a terminal in VSCode with `Command-J` or by clicking Terminal -> New Terminal
- Create a directory to put your source code and change to that directory
  - `mkdir -d src && cd src`

## Initialize Geoprocessing Project

Now we'll create a new project using `geoprocessing init`.

```sh
npx @seasketch/geoprocessing@latest init
```

This command uses `npx`, which comes with `npm` and allows you to execute commands in a package. In this case it will fetch the `geoprocessing` library from the `npm` repository and run the `geoprocessing init` command to create a new project.

`init` will download the framework, and then collect project metadata from you by asking questions.

### Project metadata

As an example, assume you are developing reports for the country of `The Federated States of Micronesia`.

```text
? Choose a name for your project fsm-report-test
? Please provide a short description of this project Test drive
```

Now paste the URL of the github repository you created in the first step

```text
? Source code repository location https://github.com/[YOUR_USERNAME_OR_ORG]/fsm-reports-test
```

You will then be asked for the name and email that establishes you as the author of this project. It will default to your git settings. Change it as you see fit for establishing you as the author of the project.

```text
? Your name Alex
? Your email alex@gmail.com
```

Now provide your organization name associated with authoring this project

```text
? Organization name (optional)
```

Choose a software license. [SeaSketch](https://github.com/seasketch/next/blob/master/LICENSE) and [Geoprocessing](https://github.com/seasketch/geoprocessing/blob/dev/LICENSE) both use BSD-3 (the default choice). If you are not a member of SeaSketch you are not required to choose this. In fact, you can choose `UNLICENSED` meaning proprietary or "All rights reserved" by you, the creator of the work.

```text
? What software license would you like to use? BSD-3-Clause
```

Choose an AWS region you would like to deploy the project. The most common is to choose `us-west-1` or `us-east-1`, the US coast closest to the project location. In some circumstances it can make sense to choose locations in Europe, Asia, Australia, etc. that are even closer but in practice this usually doesn't make a significant difference.

```text
? What AWS region would you like to deploy functions in?
```

Now enter the type of planning area for your project. Choose Exclusive Economic Zone which is the area from the coastline to 200 nautical miles that a country has jurisdiction over.

```text
? What type of planning area does your project have? Exclusive Economic Zone (EEZ)
```

Since you selected EEZ, it will now ask what countries EEZ to use. Choose Micronesia

```text
? What countries EEZ is this for? Micronesia.
```

If you answered `Other` to type of planning area it will now ask you for the name of this planning area.

```text
?  Is there a more common name for this planning area to use in reports than Micronesia? (Use arrow keys)
❯ Yes
  No
```

Answer `No`. If you answered yes it would ask you:

```text
What is the common name for this planning area?
```

Finally, you will be asked to choose a starter template. Choose `template-ocean-eez`. It will come with some features out of the box that are designed for EEZ planning. `template-blank-project` is a barebones template and let's you start almost from scratch.

```text
? What starter-template would you like to install?
  template-blank-project - blank starter project
❯ template-ocean-eez - template for ocean EEZ planning project
```

After pressing Enter, your project will finish being created and installing all dependencies in `~/src/fsm-reports`.

#### Blank starter project

Note, if you had selected `Blank starter project` as your template, it would then ask you for the bounding box extent of your projects planning area, in latitude and longitude.

```text
? What is the projects minimum longitude (left) in degrees (-180.0 to 180.0)?
? What is the projects minimum latitude (bottom) in degrees (-180.0 to 180.0)?
? What is the projects maximum longitude (right) in degrees (-180.0 to 180.0)?
? What is the projects maximum latitude (top) in degrees (-180.0 to 180.0)?
```

The answers to these questions default to the extent of the entire world, which is a reasonable place to start. This can be changed at a later time.

## Open in VSCode Workspace and Explore Structure

Next, to take full advantage of VSCode you will need to open your new project and establish it as a workspace.

### If Running Devcontainer (Install Option 1)

Once you have more than one folder under `/workspaces` backed by a git repository, VSCode will be default to a `multi-root` workspace.

For the best experience, you will want open a single workspace in your VSCode for a single folder in your devcontainer.

`File` -> `Open folder` -> /workspaces/fsm-report-test

VSCode should now reopen the under this new workspace, using the existing devcontainer, and you're ready to go.

### If Running MacOS Bare Metal / Windows WSL (Install Option 2)

Type `Command-O` on MacOS or `Ctrl-O` on Windows or just click `File`->`Open` and select your project under `[your_username]/src/fsm-reports-test`

VSCode will re-open and you should see all your project files in the left hand file navigator.

- Type `Command-J` (MacOS) or `Ctrl-J` (Windows) to reopen your terminal. Make this a habit to have open.

### Project Structure

Next, take some time to learn more about the structure of your new project, and look through the various files. You can revisit this section as you get deeper into things.

### Configuration Files and Scripts

There are a variety of project configuration files. Many have been pre-populated usings your answers to the initial questions. You can hand edit most of these files later to change them, with some noted exceptions.

- `package.json` - Javascript [package](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) configuration that defines things like the project name, author, and third-party dependencies. The [npm](https://docs.npmjs.com/cli/v6/commands) command is typically used to add, upgrade, or remove dependencies using `npm install`, otherwise it can be hand-edited.
- `tsconfig.json` - contains configuration for the [Typescript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) compiler
- `project/` - contains project configuration files.
  - `basic.json` - contains basic project configuration
    - `planningAreaType`: `eez` or `other`
    - bbox - the bounding box of the project as [bottom, top, left, right]. This generally represents the area that users will draw shapes. It can be used as a boundary for clipping, to generate examples sketches, and as a window for fetching from global datasources.
    - `planningAreaId` - the unique identifier of the planning region used by the boundary dataset. If your planningAreaType is `eez` and you want to change it, you'll find the full list [in github](https://raw.githubusercontent.com/seasketch/geoprocessing/dev/packages/geoprocessing/scripts/global/datasources/mr-eez-precalc.json), just look at the UNION property for the id to use
    - `planningAreaName` - the name of the planning region (e.g. Micronesia)
    - `externalLinks` - central store of links that you want to populate in your reports.
    - `languages` - array of languages to enable for translation. Master list of language codes are in `src/i18n/languages.json`.
  - `geoprocessing.json` - file used to register assets to be bundled for deployment. If they aren't registered here, then they won't be included in the bundle.
  - `geographies.json` - contains one or more planning geographies for your project. If you chose to start with a blank project template, you will have a default geography of the entire world. If you chose to start with the Ocean EEZ template, you will have a default geography that is the EEZ you chose at creation time. Geographies must be manually added/edited in this file. You will then want to re-run `precalc` and `test` to process the changes and make sure they are working as expected. Learn more about [geographies](../concepts/Concepts.md#geographies)
  - `datasources.json` - contains an array of one or more registered datasources, which can be global (url) or local (file path), with a format of vector or raster or subdivided. Global datasources can be manually added/edited in this file, but local datasources should use the [import](#importing-your-data) process. After import, datasources can be manually added/edited in this file. You will then want to run `reimport:data`, `precalc:data`, `precalc:clean`, and `test` to process the changes and make sure they are working as expected. Learn more about [datasources](../concepts/Concepts.md#datasources)
  - `metrics.json` - contains an array of one or more metric groups. Each group defines a metric to calculate, with one or more data classes, derived from one or more datasources, measuring progress towards a planning objective. An initial boundaryAreaOverlap metric group is included in the file by default that uses the global eez datasource. Learn more about [metrics](../concepts/Concepts.md#metrics)
  - `objectives.json` - contains an array of one or more objectives for your planning process. A default objective is included for protection of `20%` of the EEZ. Objectives must be manually added/edited in this file. Learn more about [objectives](../concepts/Concepts.md#objectives)
  - `precalc.json` - contains precalculated metrics for combinations of geographies and datasources. Specifically it calculates for example the total area/count/sum of the portion of a datasources features that overlap with each geography. This file should not be manually edited. If you have custome metrics/precalculations to do, then use a separate file. Learn more about the [precalc](#precalc-data) command.

The object structure in many of the JSON files, particularly the `project` folder, follow strict naming and structure (schema) that must be maintained or you will get validation errors when running commands. Adding additional undocumented properties may be possible, but is not tested. The schemas are defined here:

- [Basic](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/projectBasic.ts)
- [Geographies](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/geography.ts)
- [Datasources](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/datasource.ts)
- [MetricGroup](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/metricGroup.ts)
  - [DataClass](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/dataclass.ts)
- [Objective](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/objective.ts)
- [Precalc Metrics](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/metrics.ts)

### Project Assets

- `src/` - contains all source code
  - `clients/` - report clients are React UI components that can be registered with SeaSketch and when given a sketch URL as input, are able to run the appropriate geoprocessing functions and display a complete report. This can include multiple report pages with tabbed navigation.
  - `components/` - components are the UI building blocks of report clients. They are small and often reusable UI elements. They can be top-level ReportPage components, ResultCard components within a page that invoke geoprocessing functions and display the results, or much lower level components like custom Table or Chart components. You choose how to build them up into sweet report goodness.
  - `functions/` - contains preprocessor and geoprocessor functions that take input (typicall sketch features) and return output (typically metrics). They get bundled into AWS Lambda functions and run on-demand.
  - `i18n/` - contains building blocks for localization aka language translation in reports.
    - `scripts/` - contains scripts for working with translations
    - `lang/` - contains english terms auto-extracted from this projects report clients and their translations in one or more languages.
    - `baseLang/` - contains english terms and their translations for all UI components and report client templates available through the geoprocessing library. Used to seed the `lang` folder and as a fallback.
    - `config.json` - configuration for integration with POEditor localization service.
    - `extraTerms.json` - contains extra translations. Some are auto-generated from configuration on project init, and you can add more such as plural form of terms.
    - `i18nAsync.ts` - creates an i18next instance that lazy loads language translations on demand.
    - `i18nSync.ts` - creates an i18nnext instance that synchronously imports all language translations ahead of time. This is not quite functional, more for research.
    - `languages.json` - defines all of the supported languages. New languages codes can be added manually, or using `upgrade` command.

A [ProjectClient](https://seasketch.github.io/geoprocessing/api/classes/geoprocessing.ProjectClientBase.html) class is available in `project/projectClients.ts` that is used in project code for quick access to all project configuration including methods that ease working with them. This is the bridge that connects configuration with code and is the backbone of every geoprocessing function and report client.

### Other Files

- `node_modules` - contains all of the npm installed third-party code dependencies defined in package.json
- `README.md` - default readme file that becomes the published front page of your repo on github.com. Edit this with information to help your users understand your project. It could include information or sources on metric calculations and more.
- `package-lock.json` - contains [cached metadata](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json) on the 3rd party modules you have installed. Updates to this file are made automatically and you should commit the changes to your repository at the same time as changes to your package.json.
- `.nvmrc` - a lesser used config file that works with nvm to define the node version to use for this project. If you use nvm to manage your node version as suggested then you can run `nvm use` in your project and it will install and switch to this version of node.

To learn more, check out the [Architecture](../architecture/Architecture.md) page

## Generate Examples

In order to create and test out the functions and report clients installed with `template-ocean-eez`, we need sample data that is relevant to our planning area. Scripts are available that make this easy.

`genRandomSketch` - generates a random Sketch polygon within the extent of your planning area, which are most commonly used as input to geoprocessing functions. Run it without any arguments to generate a single Sketch polygon in the `examples/sketches` directory of your project. Run it with an argument of `10` and it will generate a SketchCollection with 10 random Sketch polygons.

```bash
npx tsx scripts/genRandomSketch.ts
npx tsx scripts/genRandomSketch.ts 10
```

`genRandomFeature` - generates random Feature Polygons within the extent of your planning area, which are most commonly used as input to preprocessing functions. Run it without any arguments to generate a single Sketch polygon in the `examples/features` directory of your project.

```bash
npx tsx scripts/genRandomFeature.ts
```

### Differences

Look closely at the difference between the example features and the example sketches and sketch collections. Sketch and sketch collections are just GeoJSON Feature and FeatureCollection's with some extra attributes. That said, sketches and sketch collections are technically not compliant with the GeoJSON spec but they are often passable as such in most tools.

### Create Custom Sketches

In addition to these scripts, you can create features and sketches using your GIS tool of choice, or draw your own polygons using [geojson.io](https://geojson.io). If you already have your SeaSketch project site set-up, you can draw a sketch and export it as geojson, uploading it to the `examples/sketches` directory.

## Import Data

Navigate to `datasources.json`. This is where available data sources to use in reports are listed. When we import a new datasource, an entry will be automatically added to this file.

### Link Project Data

In order to `import` and `publish` local project data to the cloud, it will need to be accessible on your local computer. There are multiple ways to do this, choose the appropriate one for you.

#### Option 1. Keep your data where it is

Nothing to do, you will keep your data where it is on your local computer, and provide a direct path to this location on import.

Pros:

- Simple. Can start with this and progress to more elaborate strategies
- Keeps your data separate from your code
- Can import data from different parts of your filesystem

Cons:

- Can make it hard to collaborate with others because they'll have to match your file structure, which may not be possible for some reason.

#### Option 2. Keep your data in your project repository

Copy your datasources directly into the `data/src` directory.

Pros:

- Data and relative import paths are consistent between collaborators
- Data can be kept under version control along with your code. Just check out and it's ready to go.

Cons:

- You have an additional copy of your data to maintain. You may not have a way to tell if your data is out of data or not from the source of truth.
- The github repository can get big fast if you have or produce large datasets.
- If your data should not be shared publicly, then the code repo will need to be kept private, which works against the idea of transparent and open science.
- If any file is larger than 100MB it will require use of [Git LFS](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
  - Maximum of 5gb file size

MacOS this could be as easy as:

```bash
cp -r /my/project/data data/src
```

Windows, you can copy files from your Windows C drive into Ubuntu Linux using the following:

```bash
cp -r /mnt/c/my_project_data data/src
```

Change the `.gitignore` file to allow you to commit your data/src and data/dist directory to Git. Remove the following lines:

```bash
data/src/**
data/dist/**
```

It's up to you to not make sensitive data public. By choosing this option, you are possibly committing to it always being private and under managed access control.

#### Option 3. Link Data

A symbolic link, is a file that points to another directory on your system. What you can do is create a symbolic link at `data/src` that points to the top-level directory where you data is maintained elsewhere on your system.

Pros:

- Keeps your data separate from your code but accessed in a consistent way through the `data/src` path.
- Works with cloud-based drive share products like Box and Google Drive which can be your centralized source of truth.

Cons:

- Symbolic links can be a little harder to understand and manage, but are well documented.
- People managing the source of truth that is linked to may update or remove the data, or change the file structure and not tell you. Running `reimport` scripts will fail and `datasources.json` paths will need to be updated to the correct place.

Steps:

- First, if you use a Cloud Drive product to share and sync data files, make sure your data is synced and you know the path to access it. See [access Cloud Drive folder](../skills.md#access-cloud-drive-folder)
- Assuming you are using MacOS and your username is `alex`, your path would be `/Users/alex/Library/CloudStorage/Box-Box`

To create the symbolic link, open a terminal and make sure you are in the top-level directory of your geoprocessing project:

```bash
ln -s /Users/alex/Library/CloudStorage/Box-Box data/src
```

Confirm that the symbolic link is in place, points back to your data, and you can see your data files

```bash
ls -al data
ls -al data/src
```

If you put your link in the wrong folder or pointed it to the wrong place, you can always just `rm data/src` to remove it, then start over. It will only remove the symbolic link and not the data it points to.

#### In Summary

None of these options solve the need for collaborators to manage data carefully, to communicate changes, and to ensure that updates are carried all the way through the data pipeline in a coordinated fashion. The data won't keep itself in sync.

For all of these options, you can tell if your data is out of sync:

- `data/src` is out of date if the `Date modified` timestamp for a file is older than the timestamp for the same file wherever you source and copy your data from.
- `data/dist` is out of date with `data/src` if the `Date modified` timestamp for a file is older than the timestamp for the same file in `data/src`.

#### Example data for tutorial

This tutorial will use data for the Federated States of Micronesia downloaded from [Allen Coral Atlas](https://allencoralatlas.org/atlas/#8.67/-13.7942/-171.9575). (Note: you can download this data for free for any country. Turn on Maritime Boundaries, select your country’s EEZ, and download after creating an account.) Download `reefextent.gpkg` and `benthic.gpkg`, and make the data accessible to your project through one of the data linking methods described above.

### Importing Your Data

The framework supports import of both vector and raster datasources and this tutorial assumes you have datasets that you want to import, accessible in the `data/src` directory, because you have [linked your project data](#link-project-data). If you are using the Allen Coral Atlas data described above, continue with [Import Vector Datasource](#import-vector-datasource).

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

Assuming you are using the [FSM data](#example-data-for-tutorial) from Allen Coral Atlas available now in your `data/src` directory. Let's import the `reefextent` vector data from the geopackage.

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

What if you have a vector file with multiple classes you want to group metrics by? The other [downloaded example data](#example-data-for-tutorial) `benthic.gpkg` separates different benthic habitats (Sand, Seagrass, Coral) by a `class` parameter. The import for this datasource looks as follows:

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

- Reproject the data to the WGS84 spherical coordinate system, aka EPSG:4326.
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
? Enter path to src file (with filename) data/src/current-raster/offshore/inputs/features/yesson_octocorals.tif
```

Choose a datasource name that is different than any other datasourceId in `projects/datasources.json`. The command won't let you press enter if it's a duplicate.

```bash
? Choose unique datasource name (a-z, A-Z, 0-9, -, _), defaults to filename octocorals
```

If the raster has more than one band of data, select the band you want to import.

```bash
? Enter band number to import 1
```

Choose what the raster data represents
`Quantitative` - measures one thing. This could be a binary 0 or 1 value thatidentifies the presence or absence of something, or a value that varies over the geographic surface such as temperature.
`Categorical` - measures presence/absence of multiple groups. The value of each cell in the band is a numeric group identifier, and thus each cell can represent one and only one group at a time.

```bash
❯ Quantitative - values represent amounts, measurement of single thing
  Categorical - values represent groups
```

At this point the import will proceed and various log output will be generated.

Do not be concerned about an error that an ".ovr" file could not be found. This is expected. Once complete you will find:

- The output file `data/dist/octocorals.tif`
- An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `octocorals`.

If the import fails, try again double checking everything. It is most likely one of the following:

- You aren't running Docker Desktop (required for running GDAL commands)
- You provided a source file path that doesn't point to a valid dataset
- You aren't using a file format supported by GDAL

### Global datasource

You are also able to use one of the global data sources already provided in `datasources.json`. They are already imported.

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

Check out [advanced storybook usage](#advanced-storybook-usage) when necessary.

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

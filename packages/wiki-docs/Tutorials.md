These tutorials will teach you the fundamentals of creating and deploying a `geoprocessing` project. They expect you have a basic working knowledge of your computer, command line interfaces, and web application development.  There is also a limit to what the framework can do out of the box and at some point you will likely need to extend it to create custom reports.  What follows is a short list of resources to help you:

* [Git and Github](https://www.youtube.com/watch?v=RGOj5yH7evk)
* [Node JS](https://www.freecodecamp.org/news/what-is-node-js/) development
* [VSCode](https://www.youtube.com/watch?v=WPqXP_kLzpo) integrated development environment (IDE)
* [Code debugging](https://www.freecodecamp.org/news/what-is-debugging-how-to-debug-code/)
* [Bash](https://www.freecodecamp.org/news/linux-command-line-bash-tutorial/) command line
* [React](https://www.freecodecamp.org/learn/front-end-development-libraries/#react) user interface development
* [Typescript](https://www.freecodecamp.org/news/programming-in-typescript/) code development
* [QGIS](https://www.qgis.org/en/site/) and [tutorials](https://www.qgistutorials.com/en/)
* [GDAL](https://gdal.org/index.html) and [tutorials](https://gdal.org/tutorials/index.html)

# Tutorial List

* [Initial system setup](#initial-system-setup)
* [Setup an existing geoprocessing project](#setup-an-exising-geoprocessing-project)
* [Create a new geoprocessing project](#create-a-new-geoprocessing-project)
* [Open in VSCode Workspace and Explore Structure](#open-in-vscode-workspace-and-explore-structure)
* [First Project Build](#first-project-build)
* [Generate Examples](#generate-examples)
* [Test Your Project](#test-your-project)
* [Link project data](#link-project-data)
* [Import datasource](#import-datasource)
* [Setup Language Translation](#setup-language-translation)
* [Deploy your project](#deploy-your-project)
* [Publish a datasource](#publish-a-datasource)
* [Creating a SeaSketch Project and Exporting Test Sketches](#creating-seasketch-project-and-exporting-test-sketches)
* [View Reports in Storybook](#view-reports-in-storybook)
* [Integrating Your Project With SeaSketch](#integrating-your-project-with-seasketch)
* [Debugging](#debugging)
* [Upgrading](#upgrading)
* [Subdivide Datasources](#subdivide-datasources)
* [Use Docker Geoprocessing Workspace](#use-docker-geoprocessing-workspace)

# Assumptions

Unless otherwise instructed:

* You are working within VSCode, with your top-level directory open as the project workspace
* All commands are entered within a VSCode terminal, usually with the top-level project directory as the current working directory

# Initial System Setup

This tutorial gets your system ready to [create a new geoprocessing project](#create-a-new-geoprocessing-project) or [setup an existing project](#setup-an-exising-geoprocessing-project).

Examples of existing projects for reference and inspiration.  Note, some may use older versions of the geoprocessing library and may look a little different.

* [FSM Reports](https://github.com/seasketch/fsm-reports)
* [Samoa Reports](https://github.com/seasketch/samoa-reports)
* [Maldives Nearshore Reports](https://github.com/seasketch/maldives-nearshore-reports)
* [Azores Nearshore Reports](https://github.com/seasketch/azores-nearshore-reports)

You will need a computer running at least:

* Windows 11
* MacOS 11.6.8 Big Sur
* Linux: untested but recent versions of Linux such as Ubuntu, Debian, or Fedora should be possible that are capable of running VSCode and Docker Desktop.

Web browser:

* Chrome is the most common but Firefox, Safari, Edge can also work.  Their developer tools will all be a little different.

## MacOS

* Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for either Apple chip or Intel chip as appropriate to your system and make sure it's running.
  * If you don't know which you have, click the apple icon in the top left and select `About This Mac` and look for `Processor`
* Install [Node JS](https://nodejs.org/en/download/) >= v16.0.0
  * [nvm](https://github.com/nvm-sh/nvm) is great for this, then `nvm install v16`.  May ask you to first install XCode developer tools as well which is available through the App Store or follow the instructions provided when you try to install nvm.
  * Then open your Terminal app of choice and run `node -v` to check your node version
* Install [VS Code](https://code.visualstudio.com)
  * Install recommended [extensions](https://code.visualstudio.com/docs/editor/extension-marketplace) when prompted.  If not prompted, go to the `Extensions` panel on the left side and install the extensions named in [this file](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/templates/project/.vscode/extensions.json)

* Install [NPM](https://www.npmjs.com/) package manager >= v8.5.0 after installing node.  The version that comes with node may not be recent enough.
  * `npm --version` to check
  * `npm install -g latest`

* Install [Java runtime](https://www.java.com/en/download/) for MacOS (required by AWS CDK library)

* Create a free Github account if you don't have one already
  * Set your git username

## Windows

For Windows, your `geoprocessing` project and the underlying code run in a Docker container running Ubuntu Linux.  This is done using the Windows Subsystem for Linux (WSL2) so performance is actually quite good.  Docker Desktop and VSCode both know how to work seamlessly with WSL2.  Some of the building blocks you will install in Windows (Git, AWSCLI) and link them into the Ubuntu Docker container.  The rest will be installed directly in the Ubuntu Docker container.

In Windows:

* Install [WSL2 with Ubuntu distribution](https://learn.microsoft.com/en-us/windows/wsl/install)
* Install [Docker Desktop with WSL2 support](https://docs.docker.com/desktop/windows/wsl/) and make sure Docker is running
* Open start menu -> `Ubuntu on Windows`
  * This will start a bash shell in your Ubuntu Linux home directory

In Ubuntu:

* Install [Java runtime](https://stackoverflow.com/questions/63866813/what-is-the-proper-way-of-using-jdk-on-wsl2-on-windows-10) in Ubuntu (required by AWS CDK library)
* Install [Git in Ubuntu and Windows](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-git)
* Install [VS Code](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode) in Windows and setup with WSL2.
  * Install recommended [extensions](https://code.visualstudio.com/docs/editor/extension-marketplace) when prompted.  If not prompted, go to the `Extensions` panel on the left side and install the extensions named in [this file](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/templates/project/.vscode/extensions.json)
* Install [Node JS](https://nodejs.org/en/download/) >= v16.0.0 in Ubuntu
  * [nvm](https://github.com/nvm-sh/nvm) is great for this, then `nvm install v16`.
  * Then open your Terminal app of choice and run `node -v` to check version
* Install [NPM](https://www.npmjs.com/) package manager >= v8.5.0 after installing node.  The version that comes with node may not be recent enough.
  * `npm --version` to check
  * `npm install -g latest`

## Final Steps

If you haven't already, establish the [username](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git?platform=mac) and email address git should associate with your commits

You can set these per repository, or set them globall on your system for all repositories and override them as needed.  Here's the commands to set globally

```bash
git config --global user.name "Your Name"
git config --global user.email "yourusername@yourprovider.com"
```

Now verify it was set:

```bash
# If you set global - all repos
cat ~/.gitconfig

# If you set local - current repo
cat .git/config
```

At this point your system is ready for you to `create a new project`, or `setup an existing project`

# Setup an exising geoprocessing project

This use case is where a geoprocessing project already exists, but it was developed on a different computer.

## Link your source data

1. figure out [which option](#link-project-data) was used to bring data into your geoprocessing project, and follow the steps to set it up.

* Option 1, you're good to go, the data should already be in `data/src` and src paths in `project/datasources.json` should have relative paths pointing into it.
* Option 2, Look at `project/datasources.json` for the existing datasource paths and if your data file paths and operating system match you may be good to go.  Try re-importing your data as below, and if it fails consider migrating to Option 1 or 3.
* Option 3, you'll just need to symlink the `data/src` project directory to your data.  Make sure you point it to the right level of your data folder.  Check the src paths in `project/datasources.json`.  If for example the source paths start with `data/src/Data_Received/...` and your data directory is at `/Users/alex/Library/CloudStorage/Box-Box/ProjectX/Data_Received`, you want to create your symlink as such

```bash
ln -s /Users/alex/Library/CloudStorage/Box-Box/ProjectX data/src
```

Assuming `data/src` is now populated, you need to ensure everything is in order

2.Reimport your data

This will re-import, transform, and export your data to `data/dist`, which is probably currently empty.

```bash
npm run reimport:data
```

Say yes to reimporting all datasources, and no to publishing them (we'll get to that).

If you see error, look at what they say.  If they say datasources are not being found at their path, then something is wrong with your drive sync (files might be missing), or with your symlink if you used option 3.

If all is well, you should see no error, and `data/dist` should be populated with files. In the Version Control panel your datasources.json file will have changes, including some updated timestamps.

But what if git changes show a lot of red and green?

* You should look closer at what's happening.  If parts of the file are being re-ordered, that may just be because Javascript is being a little bit different in how it generates JSON files from the other computer.
* If you are seeing changes to your keyStats values however (area, sum, count), then your datasources may be different from the last person that ran it.  You will want to make sure you aren't using an outdated older version.  If you are using an updated more recent version, then convince yourself the changes are what you expect, for example total area increases or decreases.

What if you just can't your data synced properly, and you just need to move forward?

* If the project was deployed to AWS, then there will be a copy of the published data in the `datasets` bucket in AWS S3.
* To copy this data from AWS back to your `data/dist` directory use the following, assuming your git repo is named `fsm-reports-test`
  * `aws s3 sync s3://gp-fsm-reports-test-datasets data/dist`

# Create a New Geoprocessing Project

Assuming [initial system setup](#initial-system-setup) is complete.

This tutorial now walks through generating a new geoprocessing project codebase and committing it to Github.

Windows:

* Open start menu -> `Ubuntu on Windows`
  * This will start a bash shell in your Ubuntu Linux home directory
* Create a directory to put your source code
  * `mkdir -d src`
* Start VSCode in the Ubuntu terminal
  * `code .`
  * This will install a vscode-server package that bridges your Windows and Ubuntu Linux environments so that VSCode will run in Windows and connect with your source code living in your Ubuntu Linux project directory.
* Open a terminal in VSCode with `Ctrl-J` in Windows or by clicking Terminal -> New Terminal.
  * The current directory of the terminal should be your project folder.

MacOS:

* Open Finder -> Applications -> VSCode
* Open a terminal in VSCode with `Command-J` or by clicking Terminal -> New Terminal
* Create a directory to put your source code and change to that directory
  * `mkdir -d src && cd src`

Now we'll create a new project using `geoprocessing init`.

```sh
npx @seasketch/geoprocessing init
```

This command uses `npx`, which comes with `npm` and allows you to execute commands in a package.  In this case it will fetch the `geoprocessing` library from the `npm` repository and run the `geoprocessing init` command to create a new project.

`init` will download the framework, and then collect project metadata from you by asking questions.

## Project metadata

As an example, assume you are developing reports for the country of `The Federated States of Micronesia`.

```text
? Choose a name for your project fsm-report-test
? Please provide a short description of this project Test drive
```

Now paste the URL of the github repository you created in the first step

```text
? Source code repository location https://github.com/[YOUR_USERNAME_OR_ORG]/fsm-reports-test
```

You will then be asked for the name and email that establishes you as the author of this project.  It will default to your git settings.  Change it as you see fit for establishing you as the author of the project.

```text
? Your name Alex
? Your email alex@gmail.com
```

Now provide your organization name associated with authoring this project

```text
? Organization name (optional)
```

Choose a software license.  [SeaSketch](https://github.com/seasketch/next/blob/master/LICENSE) and [Geoprocessing](https://github.com/seasketch/geoprocessing/blob/dev/LICENSE) both use BSD-3 (the default choice).  If you are not a member of SeaSketch you are not required to choose this.  In fact, you can choose `UNLICENSED` meaning proprietary or "All rights reserved" by you, the creator of the work.

```text
? What software license would you like to use? BSD-3-Clause
```

Choose an AWS region you would like to deploy the project. The most common is to choose `us-west-1` or `us-east-1`, the US coast closest to the project location.  In some circumstances it can make sense to choose locations in Europe, Asia, Australia, etc. that are even closer but in practice this usually doesn't make a significant difference.

```text
? What AWS region would you like to deploy functions in?
```

Now enter the type of planning area for your project.  Choose Exclusive Economic Zone which is the area from the coastline to 200 nautical miles that a country has jurisdiction over.

```text
? What type of planning area does your project have? Exclusive Economic Zone (EEZ)
```

Since you selected EEZ, it will now ask what countries EEZ to use.  Choose Micronesia

```text
? What countries EEZ is this for? Micronesia.
```

If you answered `Other` to type of planning area it will now ask you for the name of this planning area.

```text
?  Is there a more common name for this planning area to use in reports than Micronesia? (Use arrow keys)
❯ Yes
  No
```

Answer `No`.  If you answered yes it would ask you:

```text
What is the common name for this planning area?
```

Finally, you will be asked to choose a starter template.  Choose `template-ocean-eez`. It will come with some features out of the box that are designed for EEZ planning.  `template-blank-project` is a barebones template and let's you start almost from scratch.

```text
? What starter-template would you like to install?
  template-blank-project - blank starter project
❯ template-ocean-eez - template for ocean EEZ planning project
```

After pressing Enter, your project will finish being created and installing all dependencies in `~/src/fsm-reports`.

## Blank starter project

Note, if you had selected `Blank starter project` as your template, it would then ask you for the bounding box extent of your projects planning area, in latitude and longitude.

```text
? What is the projects minimum longitude (left) in degrees (-180.0 to 180.0)?
? What is the projects minimum latitude (bottom) in degrees (-180.0 to 180.0)?
? What is the projects maximum longitude (right) in degrees (-180.0 to 180.0)?
? What is the projects maximum latitude (top) in degrees (-180.0 to 180.0)?
```

The bounding box can be used to represent the area that users will draw shapes. It can be used as a boundary for clipping, to generate examples sketches, and as a window for fetching from global datasources.

There are a couple of ways you can figure the bounding box extent out:

* If you have a polygon or raster dataset representing the extent of your project, you can lookup the extent in QGIS under [layer properties](https://docs.qgis.org/3.22/en/docs/user_manual/working_with_vector/vector_properties.html#information-properties).
* Use the [coordinate display](https://tools.geofabrik.de/calc/#type=geofabrik_standard&bbox=5.538062,47.236312,15.371071,54.954937&tab=1&proj=EPSG:4326&places=2) tool from GeoFabrik to identify the bounding box of your planning area.  Use the values from the `Osmosis Copy` section for the top, bottom, left, and right values.
* Use Google Maps and click on a location in the bottom left of your planning area.  It will display a coordinate in the order (min latitude, min, longitude).  Enter these numbers one at atime. Then click on a location in the rop right of your planning area.  It will display a coordinate in the order (max latitude, max longitude).  Enter these numbers one at a time.

The reason you will need to define a bounding box is so that any preprocessing or geoprocessing functions that use global datasets can Just keep in mind that this bounding box should encompass the area that users are allowed to draw.

# Open in VSCode Workspace and Explore Structure

Next, to take full advantage of VSCode you will need to open your new project and establish it as a workspace.

Type `Command-O` on MacOS or `Ctrl-O` on Windows or just click `File`->`Open` and select your project under `[your_username]/src/fsm-reports-test`

VSCode will re-open and you should see all your project files in the left hand file navigator.

* Type `Command-J` (MacOS) or `Ctrl-J` (Windows) to reopen your terminal.  Make this a habit to have open.

## Project Structure

Next, take a minute to learn more about the structure of your new project.  You can revisit this section as you get deeper into things.

### Configuration Files and Scripts

There are a variety of project configuration files.  Many have been pre-populated usings your answers to the initial questions.  You can hand edit most of these files later to change them, with some noted exceptions.

* `package.json` - Javascript [package](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) configuration that defines things like the project name, author, and third-party dependencies.  The [npm](https://docs.npmjs.com/cli/v6/commands) command is typically used to add, upgrade, or remove dependencies using `npm install`, otherwise it can be hand-edited.
* `geoprocessing.json` - file used to register assets to be bundled for deployment.  If they aren't registered here, then they won't be included in the bundle.
* `tsconfig.json` - contains configuration for the [Typescript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) compiler
* `project/` - contains project configuration files.  
  * `basic.json` - contains basic project configuration.
    * `planningAreaType`: `eez` or `other`
    * bbox - the bounding box of the project as [bottom, top, left, right].  This generally represents the area that users will draw shapes.  It can be used as a boundary for clipping, to generate examples sketches, and as a window for fetching from global datasources.
    * `planningAreaId` - the unique identifier of the planning region used by the boundary dataset.  If your planningAreaType is `eez` and you want to change it, you'll find the full list [in github](#https://raw.githubusercontent.com/seasketch/geoprocessing/dev/packages/geoprocessing/scripts/global/datasources/eez_land_union_v3.json), just look at the UNION property for the id to use
    * `planningAreaName` - the name of the planning region (e.g. Micronesia)
    * `externalLinks` - central store of links that you want to populate in your reports.
  * `datasources.json` - contains an array of one or more registered datasources, which can be global (url) or local (file path), with a format of vector or raster or subdivided.  Global datasources can be manually added/edited in this file, but local datasources should use the [import](#import-datasource) process.
  * `metrics.json` - contains an array of one or more metric groups.  Each group defines a metric to calculate, with one or more data classes, derived from one or more datasources, measuring progress towards a planning objective.  An initial boundaryAreaOverlap metric group is included in the file by default that uses the global eez datasource.
  * `objectives.json` - contains an array of one or more objectives for your planning process.  A default objective is included for protection of `20%` of the EEZ.

The object structure in many of the JSON files, particularly the `project` folder, follow strict naming and structure (schema) that must be maintained or you will get validation errors when running commands.  Adding additional undocumented properties may be possible, but is not tested.  The schemas are defined here:

* [Basic](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/projectBasic.ts)
* [Datasources](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/datasource.ts)
* [MetricGroup](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/metricGroup.ts)
  * [DataClass](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/dataclass.ts)
* [Objective](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/objective.ts)

### Project Assets

* `src/` - contains all source code
  * `clients/` - report clients are React UI components that can be registered with SeaSketch and when given a sketch URL as input, are able to run the appropriate geoprocessing functions and display a complete report.  This can include multiple report pages with tabbed navigation.
  * `components/` - components are the UI building blocks of report clients.  They are small and often reusable UI elements.  They can be top-level ReportPage components, ResultCard components within a page that invoke geoprocessing functions and display the results, or much lower level components like custom Table or Chart components.  You choose how to build them up into sweet report goodness.
  * `functions/` - contains preprocessor and geoprocessor functions that take input (typicall sketch features) and return output (typically metrics).  They get bundled into AWS Lambda functions and run on-demand.
  * `i18n/` - contains building blocks for localization aka language translation in reports.
    * `scripts/` - contains scripts for working with translations
    * `lang/` - contains english terms auto-extracted from this projects report clients and their translations in one or more languages.
    * `baseLang/` - contains english terms and their translations for all UI components and report client templates available through the geoprocessing library.  Used to seed the `lang` folder and as a fallback.
    * `config.json` - configuration for integration with POEditor localization service.
    * `extraTerms.json` - contains extra translations. Some are auto-generated from configuration on project init, and you can add more such as plural form of terms.
    * `i18nAsync.ts` - creates an i18next instance that lazy loads language translations on demand.
    * `i18nSync.ts` - creates an i18nnext instance that synchronously imports all language translations ahead of time.  This is not quite functional, more for research.
    * `supported.ts` - defines all of the supported languages.

A [ProjectClient](https://seasketch.github.io/geoprocessing/api/classes/geoprocessing.ProjectClientBase.html) class is available in `project/projectClients.ts` that you can use in project code to get quick access to all project configuration including methods that ease working with them. This is the bridge that connects project configuration with your code so look for it and use it.

### Other Files

* `node_modules` - contains all of the npm installed third-party code dependencies defined in package.json
* `README.md` - default readme file that becomes the published front page of your repo on github.com.  Edit this with information to help your users understand your project.  It could include information or sources on metric calculations and more.
* `package-lock.json` - contains [cached metadata](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json) on the 3rd party modules you have installed.  Updates to this file are made automatically and you should commit the changes to your repository at the same time as changes to your package.json.
* `.nvmrc` - a lesser used config file that works with nvm to define the node version to use for this project.  If you use nvm to manage your node version as suggested then you can run `nvm use` in your project and it will install and switch to this version of node.

To learn more, check out the [Architecture](/Architecture.md) page

# Generate Examples

In order to create and test out the functions and report clients installed with `template-ocean-eez`, we need sample data that is relevant to our planning area.  Scripts are available that make this easy.

`genRandomSketch` - generates a random Sketch polygon within the extent of your planning area, which are most commonly used as input to geoprocessing functions.  Run it without any arguments to generate a single Sketch polygon in the `examples/sketches` directory of your project.  Run it with an argument of `10` and it will generate a SketchCollection with 10 random Sketch polygons.

```bash
npx ts-node scripts/genRandomSketch.ts
npx ts-node scripts/genRandomSketch.ts 10
```

`genRandomFeature` - generates random Feature Polygons within the extent of your planning area, which are most commonly used as input to preprocessing functions. Run it without any arguments to generate a single Sketch polygon in the `examples/features` directory of your project.

```bash
npx ts-node scripts/genRandomFeature.ts
```

## Differences

Look closely at the difference between the example features and sketches and sketch collections. Sketch and sketch collection's are just GeoJSON Feature and FeatureCollection's with some extra attributes.  Sketches and sketch collections are technically not compliant with the GeoJSON spec but they are often passable as such in most tools.

## Create Custom Sketches

In addition to these scripts, you can create features and sketches using your GIS tool of choice, or draw your own polygons using [geojson.io](https://geojson.io)

# Test your project

Now that you have sample sketches and features, you can run the test suite.

```bash
npm run test
```

## Smoke Tests

Smoke tests, in the context of a geoprocessing project, verify that your preprocessing and geoprocessing function are working, and produce an output, for a given input.  It doesn't ensure that the output is correct, just that something is produced. The input in this case is a suite of features and sketches that you manage.

Preprocessing function smoke tests (in this case `src/functions/clipToOceanEezSmoke.test.ts`) will run against every feature in `examples/features` and output the results to `examples/output`.

All geoprocessing function smoke tests (in this case `src/functions/boundaryAreaOverlapSmoke.test.ts`) will run against every feature in `examples/sketches` and output the results to `examples/output`.

This is your change to convince yourself that the smoke tests are outputting the right results.  You will commit the output for smoke tests to the code repository as a source of truth, and if the results change in the future (due to a code change or an input data change or a dependency upgrade) then you can convince yourself again that it's as expected, or something is wrong and needs investigation.  All changes to smoke test output are for a reason and should not be skipped over.

You can view the results of your smoke tests using Storybook.  It's already configured to load all of the smoke test output for each story.

## Unit Tests

Units tests go further than smoke tests, and verify that output or behavior is correct for a given input.

You should have unit tests at least for utility or helper methods that you write of any complexity, whether for geoprocessing functions (backend) or report clients (frontend).

* [Example](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/helpers/groupBy.test.ts)

You can also write unit tests for your UI components using [testing-library](https://testing-library.com/docs/react-testing-library/intro/).

* [Example](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesCard.test.tsx)

# First Project Build

A `build` of your application packages it for deployment so you don't have to build it until you are ready.  Specifically it:

* Checks all the Typescript code to make sure it's valid and types are used properly.
* Transpiles all Typescript to Javascript
* Bundles UI report clients into the `.build-web` directory
* Bundles geoprocessing and preprocessing functions into the `.build` directory.

To build your application run the following:

```bash
npm run build
```

## Debugging build failure

If the build step fails, you will need to look at the error message and figure out what you need to do.  Did it fail in building the functions or the clients?  99% of the time you should be able to catch these errors sooner.  If VSCode finds invalid Typescript code, it will warn you with files marked in `red` in the Explorer panel or with red markes and squiggle text in any of the files.

If you're still not sure try some of the following:

* Run your smoke tests, see if they pass
* When was the last time your build did succeed?  You can be sure the error is caused by a change you made since then either in your project code, by upgrading your geoprocessing library version and not migratin fully, or by changing something on your system.
* You can stash your current changes or commit them to a branch so they are not lost.  Then sequentially check out previous commits of the code until you find one that builds properly.  Now you know that the next commit cause the build error.

## Commit Initial Code To Github

Now we'll establish a remote place to store your code as a checkpoint and to allow you to collaborate on it with others.

* [Create a new Github repository](https://github.com/new) called `fsm-reports-test` (you can pick your own name but the tutorial will assume this name). When creating, do not initialize this repository with any files like a README.
* In your VSCode terminal, make sure you are in your projects top-level directory.  A shorthand way to do this is `cd ~/src/fsm-reports-test`.

Now enter the following commands to establish your project as a git repository, connect it to your Github repository you created as a remote called "origin", and finally push your code up to origin.

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/PUT_YOUR_GITHUB_ORG_OR_USERNAME_HERE/fsm-reports-test.git
git push -u origin main
```

It may ask you if it can use the Github extension to sign you in using Github.  It will open a browser tab and communicate with the Github website.  If you are already logged in there, then it should be done quickly, otherwise it may have you log-in to Github.

You should eventually see your code commit proceed in the VSCode terminal.  You can then browse to your Github repository and see that your first commit is present at https://github.com/[YOUR_GITHUB_ORG_OR_USERNAME]/foo-reports

After this point, you can continue using git commands right in the terminal to stage code changes and commit them, or you can use VSCode's [built-in git support](https://code.visualstudio.com/docs/sourcecontrol/overview).

# Link Project Data

Sample project data for Micronesia is available for [download](https://github.com/seasketch/geoprocessing/files/10560856/FSM_MSP_Data_Example_v1.zip) along with a QGIS project file for data viewing in desktop GIS.

In order to `import` and `publish` local project data to the cloud, it will need to be accessible on your local computer. There are multiple ways to do this, choose the appropriate one for you.

## Option 1. Keep your data where it is

Nothing to do, you will keep your data where it is on your local computer, and provide a direct path to this location on import.

Pros:

* Simple.  Can start with this and progress to more elaborate strategies
* Keeps your data separate from your code
* Can import data from different parts of your filesystem

Cons:

* Can make it hard to collaborate with others because they'll have to match your file structure, which may not be possible for some reason.

## Option 2. Keep your data in your project repository

Copy your datasources directly into the `fsm-reports-test/data/src` directory.

Pros:

* Data and relative import paths are consistent between collaborators
* Data can be kept under version control along with your code.  Just check out and it's ready to go.

Cons:

* You have an additional copy of your data to maintain.  You may not have a way to tell if your data is out of data or not from the source of truth.
* The github repository can get big fast if you have or produce large datasets.
* If your data should not be shared publicly, then the code repo will need to be kept private, which works against the idea of transparent and open science.
* If any file is larger than 100MB it will require use of [Git LFS](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
  * Maximum of 5gb file size

MacOS this could be as easy as:

```bash
cp -r /my/project/data data/src
```

Windows, you can copy files from your Windows C drive into Ubuntu Linux using the following:

```bash
cp -r /mnt/c/my_project_data data/src
```

Change the `.gitignore` file to allow you to commit your data/src and data/dist directory to Git.  Remove the following lines:

```bash
data/src/**
data/dist/**
```

It's up to you to not make sensitive data public.  By choosing this option, you are possibly committing to it always being private and under managed access control.

## Option 3. Link Data

A symbolic link, is a file that points to another directory on your system.  What you can do is create a symbolic link at `data/src` that points to the top-level directory where you data is maintained elsewhere on your system.

Pros:

* Keeps your data separate from your code but accessed in a consistent way through the `data/src` path.
* Works with cloud-based drive share products like Box and Google Drive which can be your centralized source of truth.

Cons:

* Symbolic links can be a little harder to understand and manage, but are well documented.
* People managing the source of truth that is linked to may update or remove the data, or change the file structure and not tell you.  Running `reimport` scripts will fail and `datasources.json` paths will need to be updated to the correct place.

Steps:

* First, if you use a Cloud Drive product to share and sync data files, make sure your data is synced and you know the path to access it.  See [access Cloud Drive folder](Tipsandtricks#access-cloud-drive-folder)
* Assuming you are using MacOS and your username is `alex`, your path would be `/Users/alex/Library/CloudStorage/Box-Box`

To create the symbolic link, open a terminal and make sure you are in the top-level directory of your geoprocessing project:

```bash
ln -s /Users/alex/Library/CloudStorage/Box-Box data/src
```

Confirm that the symbolic link is in place, points back to your data, and you can see your data files

```bash
ls -al data
ls -al data/src
```

If you put your link in the wrong folder or pointed it to the wrong place, you can always just `rm data/src` to remove it, then start over.  It will only remove the symbolic link and not the data it points to.

## In Summary

None of these options solve the need for collaborators to manage data carefully, to communicate changes, and to ensure that updates are carried all the way through the data pipeline in a coordinated fashion.  The data won't keep itself in sync.

For all of these options, you can tell if your data is out of sync:

* `data/src` is out of date if the `Date modified` timestamp for a file is older than the timestamp for the same file wherever you source and copy your data from.
* `data/dist` is out of date with `data/src` if the `Date modified` timestampe for a file is older than the timestamp for the same file in `data/src`.

# Import datasource

The framework supports import of both vector and raster datasources and this tutorial assumes you have datasets that you want to import, accessible in the `data/src` directory, because you have [linked your project data](#link-project-data).

## Import vector datasource

Vector datasets can be any format supported by [GDAL](https://gdal.org/drivers/vector/index.html) "out of the box".  Common formats include:

* GeoJSON
* GeoPackage
* Shapefile
* File Geodatabase

Importing a vector dataset into your project will:

* Reproject the dataset to the WGS84 spherical coordinate system, aka EPSG:4326.
* Transform the dataset into one or more formats including the [flatgeobuf](https://flatgeobuf.org/) cloud-optimized format and GeoJSON
* Strip out any unnecessary feature properties (to reduce file size)
* Optionally, expand multi-part geometries into single part
* Calculates overall statistics including total area, and area by group property
* Output the result to the `data/dist` directory, ready for testing
* Add datasource to `project/datasource.json`
* Optionally, publish the datasource.

Start the import process and it will ask you a series of questions, press Enter after each one, and look to see if a default answer is provided that is sufficient:

```bash
npm run import:data
? Type of data? Vector
```

Assuming you are using the [FSM example data](#link-project-data) package and it is accessible via the `data/src` directory (using [data link option 2 or 3](#link-project-data)).  Let's import the `eez` boundary from the vector geopackage.

```bash
? Enter path to src file (with filename) data/src/current-vector.gpkg
```

Choose a datasource name that is different than any other datasourceId in `projects/datasources.json`.  The command won't let you press enter if it's a duplicate.

```bash
? Choose unique datasource name (use letters,numbers, -, _ to ensure will work) eez
```

A layer name must be specified if the datasource can store multiple layers.  If your dataset can only store one datasource such as a shapefile or a GeoJSON file, then the layer name should just be the name of the file (minus the extension).  You can use the QGIS project file in the example data to view the available layers in the geopackage.

```bash
? Enter layer name, defaults to filename (eez_mr_osm)
```

If your dataset contains one or more properties that classify the vector features into one or more categories, and you want to report on those categories in your reports, then you can enter those properties now as a comma-separated list.  For example a coral reef dataset containing a `type` propertie that identifies the type of coral present in each polygon. In the case of our EEZ dataset, there are no properties like this so this question is left blank.

```bash
? Enter feature property names that you want to group metrics by (
separated by a comma e.g. prop1,prop2,prop3)
```

By default, all extraneous properties will be removed from your vector dataset on import in order to make it as small as possible.  Any additional properties that you want to keep in should be specified in this next question.  If there are none, just leave it blank.

```bash
? Enter additional feature property names to keep in final datasource (separated by a comma e.g. prop1,prop2,prop3). All others will be filtered out
```

Typically you only need to published Flatgeobuf data, which is cloud-optimized so that geoprocessing functions can fetch features for just the window of data they need (such as the bounding box of a sketch).  But GeoJSON is also available if you want to be able to import data directly in your geoprocessing function typescript files, or inspect the data using a human readable format.  Just scroll with the arrow keys and press the spacebar for each format you want to publish. Flatgeobuf is selected by default and geojson is not so just press enter if you are happy with the default.

```bash
? What formats would you like to publish?  Suggested formats 
already selected (Press <space> to select, <a> to toggle all, <i> 
to invert selection)
❯◉ fgb - FlatGeobuf
 ◯ json - GeoJSON
```

You can import and then publish your data to AWS all in one step, but typically I default to `No` here so that I can ensure it's imported properly and the `keyStats` are properly calculated.  If you answer yes, you must have already done your first deploy of the project, or else the `datasets` bucket won't exist.  You will also need to have your `awscli` setup properly IAM user account credentials.

```bash
? Do you want to publish the datasource to S3 cloud storage? (Use 
arrow keys)
  Yes 
❯ No
```

At this point the import will proceed and various log output will be generated.  Once complete you will find:

* The output file `data/dist/eez.fgb` and possibly `eez.json` if you chose to generate it.
* An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `eez`
* Also in this datasource object will be `keyStats` with a total feature `count` of 1 and a total `area` of ~3 trillion square meters.

If the import fails, try again double checking everything.  It is most likely one of the following:

* You aren't running Docker Desktop (required for running GDAL commands)
* You provided a source file path that doesn't point to a valid dataset
* You aren't using a file format supported by GDAL
* The layer name or property names you entered are invalid

## Import raster datasource

Raster datasets can be any format supported by [GDAL](https://gdal.org/drivers/raster/index.html) "out of the box".  Common formats include:

* GeoTIFF

Importing a raster dataset into your project will:

* Reproject the data to the WGS84 spherical coordinate system, aka EPSG:4326.
* Extract a single band of data
* Transform the raster into a [cloud-optimized GeoTIFF](https://www.cogeo.org/)
* Calculates overall statistics including total count and if categorical raster, a count per category
* Output the result to the `data/dist` directory, ready for testing
* Add datasource to `project/datasource.json`
* Optionally, publish the datasource.

Start the import process and it will ask you a series of questions, press Enter after each one, and look to see if a default answer is provided that is sufficient:

```bash
npm run import:data
? Type of data? Raster
```

Assuming you are using the [FSM example data](#link-project-data) package and it is accessible via the `data/src` directory (using [data link option 2 or 3](#link-project-data)).  Let's import the `yesson_octocorals` raster which is a `binary` raster containing cells with value 1 where octocorals are predicted to be present, and value 0 otherwise.

```bash
? Enter path to src file (with filename) data/src/current-raster/offshore/inputs/features/yesson_octocorals.tif
```

Choose a datasource name that is different than any other datasourceId in `projects/datasources.json`.  The command won't let you press enter if it's a duplicate.

```bash
? Choose unique datasource name (use letters, numbers, -, _ to ensure will work) octocorals
```

If the raster has more than one band of data, choose the band you want to extract.  Defaults to band 1, which is what you want if there is only one band anyway.

```bash
? Enter band number to import, defaults to 1
```

Choose what the raster data represents
`Quantitative` - measures one thing.  This could be a binary 0 or 1 value thatidentifies the presence or absence of something, or a value that varies over the geographic surface such as temperature.
`Categorical` - measures presence/absence of multiple groups.  The value of each cell in the band is a numeric group identifier, and thus each cell can represent one and only one group at a time.

```bash
❯ Quantitative - values represent amounts, measurement of single thing
  Categorical - values represent groups
```

Choose a data format to publish.  The one and only raster data format supported is a cloud-optimized GeoTIFF so press Enter and accept the default value here.

```bash
? What formats would you like publish?  Suggested formats already selected
❯◉ tif - Cloud Optimized GeoTiff
```

Raster formats often support a `nodata` value, which is a value that if assigned to a cell, should not be counted as data.  In the case of the octocorals raster, the nodata value is a very very small negative number.  The `+38' portion of this number is a shorthand way of saying add 38 zeros to the end.  In the future this value can be automatically read and used, but for now You can find this value by checking the layer properties in QGIS and copying it over verbatim.

```bash
? Enter nodata value for raster or leave blank -3.3999999521443642e+38
```

You can import and then publish your data to AWS all in one step, but typically I default to `No` here so that I can ensure it's imported properly and the `keyStats` are properly calculated.  If you answer yes, you must have already done your first deploy of the project, or else the `datasets` bucket won't exist.  You will also need to have your `awscli` setup properly IAM user account credentials.

```bash
? Do you want to publish the datasource to S3 cloud storage? (Use 
arrow keys)
  Yes 
❯ No
```

At this point the import will proceed and various log output will be generated.

Do not be concerned about an error that an ".ovr" file could not be found. This is expected.  Once complete you will find:

* The output file `data/dist/octocorals.tif`
* An updated `project/datasources.json` file with a new entry at the bottom with a datasourceId of `octocorals`
* Also in this datasource object will be `keyStats` with a total `sum` of `432`.  You can run a `Raster layer statistics` report in the QGIS Processing Toolbox and compare the values as a final check.  If they don't match, verify you entered the correct `nodata` value.

If the import fails, try again double checking everything.  It is most likely one of the following:

* You aren't running Docker Desktop (required for running GDAL commands)
* You provided a source file path that doesn't point to a valid dataset
* You aren't using a file format supported by GDAL

# Setup Language Translation

The geoprocessign framework implements the [GIP-1](./gip/GIP-1-i18n.md) proposal for language translation, and uses POEditor as its third-party service for translators to provide translations.

You do not need to complete this step unless you want to support language translation.

POEditor offers free translation for open source projects, but you are not required to use it.  You can maintain your translations locally.

## Managing Translations Using POEditor

There are 4 commands you will commonly use in working with translations: `translation:extract`, `translation:publish`, `translation:import` and `translation:sync`.  You can read more about them on the [CLI](./CLI.md) page.

When you `init` a new project it will automatically run `translation:install` and `translation:extract`, so your local translatiions in `src/i18n/lang` will be up to date.

### Setup POEditor as a developer on the SeaSketch team

* Create a new account in [POEditor](https://poeditor.com/)
* Request an invite to the SeaSketch Reports project as an admin and verify you can access it.
* Follow the instructions below to setup API credentials

### Setup POEditor As An Independent Developer

* Create a new account in [POEditor](https://poeditor.com/)
* Create a new project in POEditor
* Request open source approval for project (unlocking unlimited free translations)
  * If your project is public and open source and you would like to unlock free translations you click dashboard -> project name -> Settings -> Advanced -> Open source project
* Follow the instructions below to setup API credentials

### Setup POEditor API credentials

* Setup your API credentials
  * Click gear icon in top right -> API Access in left sidebar
  * Note API token for your user
  * Note ID number for your project
  * Add credentials to your `.bashrc` file
  
```bash
export POEDITOR_PROJECT=[YOUR_PROJECT_ID_NUMBER]
export POEDITOR_API_TOKEN=[YOUR_API_TOKEN]
```

[How do I do that?](Tipsandtricks#editing-your-startup-bash-script-in-ubuntu)

Now, verify the environment variables are set

```bash
source ~/.bashrc
echo $POEDITOR_PROJECT
echo $POEDITOR_API_TOKEN
```

### Publishing Translations to POEditor

Then `npm run translation:publish` to push the new/edited english strings to POEditor.  The strings will be tagged in POEditor with the name of the project e.g the context for yours will be (`fsm-reports-test`).

![POEditor Context](img/PoeditorContext.png "POEditor Context")


with Someone will then need to translate the strings using the POEditor service for each relevant language.

## Importing Translations from POEditor

You will then need to run `npm run translation:import` to bring these translations back into the project.  You should see files added/updated for each language code in `src/i18n/lang`.

Commit all translation files, including English and non-english, to the code repository.  These will be bundled into your production app.

## Managing Translations Locally

If you choose not to use POEditor then the easiest option is to maintain translations in your project code repository.

You will still use the `translation:extract` command to extract your strings.

You can then use the [i18n-ally](https://github.com/lokalise/i18n-ally) vscode extension to manage your translations.  Your project already includes vscode settings for using this extension in `.vscode/settings.json`.  Read the extension documentation to learn how to use for example the auto-translation feature.

## Deploying Translations

If your translations are working in storybook, then there is nothing more to do.  Your translations in `src/i18n/lang` and the base translations used as a fallback in `src/i18n/baseLang` will be bundled automatically into your app and loaded asynchronously using the `Translator`

## Adding New Languages

If your project needs to add a new language that is not already supported, follow these steps:

* Add the new language to `src/i18n/supported.ts`.  The language code should match what [SeaSketch uses](https://github.com/seasketch/next/blob/master/packages/client/src/lang/supported.ts).
* Add the language in your POEditor project.  Make sure the language code matches what SeaSketch Next is using, and what you have in supported.ts
* Translate the strings in POEditor to the new language.
* On your next run of `translation:import` a folder for the language will be added to `src/i18n/lang` and include a `translation.json` file with the strings that you translated in POEditor.

## Test report translations

When you run `start-storybook`, the story displayed will include a language switcher.  If you created your project using a starter template, strings that are displayed in the user interface are already pre-translated and the top-level report client already includes a story with a `Translator` component.  You should be able to change the language and the interface will update for all supported languages.

![Language Switcher](img/StoryTranslation.png "Language Switcher")

## Making Report Strings Translatable

Once you start adding and customizing your reports, you will need to translate any new strings you introduce to be displayed in the user interface.  To do this, you need to use [react-i18next](https://react.i18next.com/) to wrap those strings in a translator function call or `Trans` React component.  Here are some examples:

Example of using `t()` function via `useTranslation` hook to translate a string:

```typescript
import React from "react";
import { useTranslation } from "react-i18next";
const TestComponent = () => {
  const { t } = useTranslation();
  const displayString = t("This is a test")

  return (
    <p>
      {displayString}
    </p>
  );
};
```

Example of using `Trans` component to translate a string interspersed with html tags, and with a dynamic value.

```typescript
import React from "react";
import { Trans } from "react-i18next";

export const TestComponent = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p>
        📐
        <Trans i18nKey="TestComponent - area message">
          This sketch is{" "}
          <b>{{ area: Number.format(Math.round(data.area * 1e-6)) }}</b>{" "}
          square kilometers
        </Trans>
      </p>
    </div>
  );
};
```

Both `t()` and `Trans` can be used within the same file, whatever combination gets the job done.  Notice that the `Trans` example includes an `i18nKey` property.  This is useful for providing context for where this string is in the codebase, as you'll soon see in the extracted strings.  You can do the same thing with the `t` functions using `t('myKey', 'stringValue')`.

Once you've added new strings to your component or edited existing ones, and wrapped them in translation calls, you will then need to run `npm run translation:extract`.  You should then see all new/changed english string updated in `src/i18n/lang/en/translation.json`.  Here's an example project and its [translations](https://github.com/seasketch/azores-nearshore-reports/blob/main/src/i18n/lang/en/translation.json)

Here is what should be the resulting extracted strings for translation:

```json
"This is a test": "This is a test"
"TestComponent - area message": "This sketch is <2>{{area}}</2> square kilometers",
```

Notice that the second string has a translation key (`"TestComponent - area message"`) that is different from its value. Also notice that `This is a test` has the same key and value for it's translation pair.  This is because we specified an `i18nkey` in the `Trans` component, and we didn't specify a key for the `t()` example, but we could have using `t("myKey", "myValue")`.

The benefit of not specifying a key and letting it be the same as the value is that anywhere you translate this same string in your codebase, they will all use one translation.  If you specify a different key for every time you translate the same string, you will have to translate each one, causing some duplicate work for your translator.  But the benefit of specifying a key is that it can give you context for where the string is used in your code.  Based on this behavior, the recommended best practice is:

* If you have a string that is likely to be reused across your reports (think "metric", "protected area" or "planning area") then don't include a key when you wrap it in a translation.
* Andy if you have strings that you know are very specific to your report, usually sentences or paragraphs, then you can include a key to help with grouping your strings in your translation file.  One method is to use the name of the component in the key and then a short bit about what the string is you're translating. (e.g. `SizeCard - learn more`)

`react-i18n` includes much more [advanced capabilities](https://react.i18next.com/latest/using-with-hooks) for translating complex strings, and you should use them as needed.  This includes the use of `i18n` namespaces, which this framework has specifically chosen *`not`* to use for simplicity to the user. 

## Making Stories Translatable

Storybook includes a language switcher for testing out your translations, you just need to add a couple of pieces to your stories to make use of it.  Any report client installed with the starter template will already include these pieces and you can refer to them.  That said, in order for the storybook language switcher to work you need to:

* Wrap your story in a Translator, unless the component you're writing a story for already has its own Translator (e.g. report clients).
* Export your story component using a `ReportDecorator`
* Or if you want to override parts of the default ReportContext value used by the story you should export your story using `createReportStoryLayout()` instead.

Example story using default context:

```typescript
import React from "react";
import TestTable from "../TestTable";
import { ReportDecorator } from "../storybook/ReportDecorator";
import Translator from "../i18n/TranslatorAsync";

export const basic = () => (
  <Translator>
    <TestTable />
  </Translator>
);

export default {
  component: TestTable,
  title: "Components/TestTable",
  decorators: [ReportDecorator],
};
```

Example story overriding parts of report context with:

```typescript
import React from "react";
import { SizeCard } from "./SizeCard";
import {
  createReportStoryLayout,
  sampleSketchReportContextValue,
} from "@seasketch/geoprocessing/client-ui";
import Translator from "../components/TranslatorAsync";

const contextValue = sampleSketchReportContextValue({
  visibleLayers: [],
  exampleOutputs: [
    {
      functionName: "boundaryAreaOverlap",
      sketchName: "My Sketch",
      results: {
        metrics: [
          {
            metricId: "boundaryAreaOverlap",
            sketchId: "abc123",
            classId: "eez",
            groupId: null,
            geographyId: null,
            value: 75066892447.21024,
            extra: {
              sketchName: "fsm-east-west-sketch",
            },
          },
        ],
        sketch: {
          type: "Feature",
          properties: {
            name: "fsm-east-west-sketch",
            updatedAt: "2022-11-17T10:02:53.645Z",
            sketchClassId: "123abc",
            id: "abc123",
          },
          geometry: null,
        },
      },
    },
  ],
});

// Wrap in Translator to allow translations to work in storybook without report client
export const basic = () => (
  <Translator>
    <SizeCard />
  </Translator>
);

export default {
  component: SizeCard,
  title: "Project/Components/SizeCard",
  decorators: [createReportStoryLayout(contextValue)],
};
```

# Deploy your project

A `deploy` of your application uses [`aws-cdk`](https://aws.amazon.com/cdk/) to inspect your local build and automatically provision all of the necessary AWS resources as a single [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) stack.

This includes:

* S3 storage buckets for publishing datasources and containing bundled Report UI components
* Lambda functions that run preprocessing and geoprocessing functions on-demand
* A Gateway with REST API and Web Socket API for clients like SeaSketch to discover, access, and run all project resources over the Internet.
* A DynamoDB database for caching function results

For every deploy after the first, it is smart enough to compute the changeset between your local build and the published stack and modify the stack automatically.

## Setup AWS

You are not required to complete this step until you want to deploy your project and integrate it with SeaSketch.  Until then, you can do everything except `publish` data or `deploy` your project.

You will need to create an AWS account with an admin user, allowing the framework to deploy your project using CloudFormation. A payment method such as a credit card will be required.

Expected cost: [free](https://aws.amazon.com/free) to a few dollars per month.  You will be able to track this.

* Create an Amazon [AWS account] such that you can login and access the main AWS Console page (https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).
* Create an AWS IAM [admin account](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html).  This is what you will use to manage projects.

Then install `awscli`, which will allow you to deploy your project.

## AWSCLI on MacOS

* Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) it with your IAM account credentials.

## AWSCLI on Windows

Install [awscli for Windows](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). This should establish a new or default AWS profile with admin credentials and configure it for use with your Windows shell environment.

Assuming your username is `alex`, confirm you now have the following files under Windows.

```bash
C:\Users\alex\.aws\credentials
C:\Users\alex\.aws\config
```

Now, open a Ubuntu shell and edit your bash environment variables to [point to those files](https://stackoverflow.com/questions/52238512/how-to-access-aws-config-file-from-wsl-windows-subsystem-for-linux/53083079#53083079).

Add the following to your startup `.bashrc` file.

```bash
export AWS_SHARED_CREDENTIALS_FILE=/mnt/c/Users/alex/.aws/credentials
export AWS_CONFIG_FILE=/mnt/c/Users/alex/.aws/config
```

[How do I do that?](Tipsandtricks#editing-your-startup-bash-script-in-ubuntu)

Now, verify the environment variables are set

```bash
source ~/.bashrc
echo $AWS_SHARED_CREDENTIALS_FILE
echo $AWS_CONFIG_FILE
```

## Confirm awscli is working

To check if awscli is configured run the following:

```bash
aws configure list
```

If no values are listed, then the AWS CLI is not configured properly.  Go back and check everything over for this step.

## Do the deploy

To deploy your project run the following:

```bash
npm run deploy
```

When the command completes, the stack should now be deployed.  It should print out a list of URL's for accessing stack resources.  You do not need to write these down.  You can run the `npm run url` command at any time and it will output the RestApiUrl, which is the main URL you care about for integration with SeaSketch. After deploy a `cdk-outputs.json` file will also have been generated in the top-level directory of your project with the full list of URL's. This file is not checked into the code repository.

Example:

```json
{
  "gp-fsm-reports-test": {
    "clientDistributionUrl": "abcdefg.cloudfront.net",
    "clientBucketUrl": "https://s3.us-west-2.amazonaws.com/gp-fsm-reports-test-client",
    "datasetBucketUrl": "https://s3.us-west-2.amazonaws.com/gp-fsm-reports-test-datasets",
    "GpRestApiEndpointBF901973": "https://tuvwxyz.execute-api.us-west-2.amazonaws.com/prod/",
    "restApiUrl": "https://tuvwxyz.execute-api.us-west-2.amazonaws.com/prod/",
    "socketApiUrl": "wss://lmnop.execute-api.us-west-2.amazonaws.com"
  }
}
```

### Debugging deploy

* If your AWS credentials are not setup and linked properly, you will get an error here.  Go back and [fix it](#setup-aws).
* The very first time you deploy any project to a given AWS data center (e.g. us-west-1), it may ask you to bootstrap cdk first.  Simply run the following:

```bash
npm run bootstrap
```

Then `deploy` again.

* If your deploy fails and it's not the first time you deployed, it may tell you it has performed a `Rollback` on the deployed stack to its previous state.  This may or may not be successful. You'll want to verify that your project is still working properly within SeaSketch.  If it's not you can always destroy your stack by running:

```bash
npm run destroy
```

Once complete, you will need to `build` and `deploy` again.

# Publish a datasource

Once you have deployed your project to AWS, it will have an S3 bucket for publishing `datasources` to.

Your datasources will need to have already been imported using `import:data` and exist in data/dist for this to work.

```bash
npm run publish:data
```

It will ask you if you want to publish all datasources, or choose from a list.

* Note if you don't publish your datasources, then your smoke tests may work properly, but your geoprocessing functions will throw file not found errors in production.

# Creating SeaSketch Project and Exporting Test Sketches

Using `genRandomSketch` and `genRandomFeature` is a quick way to get started with sample sketches that let's you run your smoke tests for your geoprocessing function and view them in a storybook.  Once you do that, you can move on to creating example sketches for very specific locations within your planning area with exactly the sketch properties you want to test.  This is most easily done using SeaSketch directly.

First, follow the [instructions](https://docs.seasketch.org/seasketch-documentation/administrators-guide/getting-started) to create a new SeaSketch project.  This includes defining the planning bounds and [creating a Sketch class](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes).  You will want to create a `Polygon` sketch class with a name that makes sense for you project (e.g. MPA for Marine Protected Area) and then also a `Collection` sketch class to group instances of your polygon sketch class into.  Note that sketch classes are where you will integrate your geoprocessing services to view reports, but you will not do it at this time.

One you've created your sketch classes, follow the instructions for [sketching tools](https://docs.seasketch.org/seasketch-documentation/users-guide/sketching-tools) to draw one or more of your polygon sketches.  You can also create one or more collections and group your sketches into them.

Finally, [export](https://docs.seasketch.org/seasketch-documentation/users-guide/sketching-tools#downloading-sketches) your sketches and sketch collections as GeoJSON, and move them into your geoprocessing projects `examples/sketches` folder.

```bash
  /examples/
    sketches/ # <-- examples used by geoprocessing functions
    features/ # <-- examples used by preprocessing functions
```

Once you add your example sketches and collections to this folder, you can `npm run test:smoke` and any smoke tests will automatically include these new examples and generate output for them for each geoprocessing function.  You can then look at the smoke test output and ensure that it is as expected.

It's now possible for you to quickly create examples that cover common as well as specific use cases. For example are you sure your geoprocessing function works with both Sketches and Sketch Collections? Then include examples of both types. Maybe even include Sketches that overlap outside the planning area to make sure error conditions are handled appropriately.  Or create a giant sketch that covers the entire planning area to make sure your reports are picking up all of the data and % overlap metrics are 100% or very close.  Does your geoprocessing project handle overlapping sketches within a collection properly?  Create all kinds of overlap scenarios.

# View Reports in Storybook

Now that you've run your smoke tests and generated example output for your functions, you can run your project storybook and view the results of those functions in your reports.

```bash
npm run start-storybook
```

# Integrating Your Project with SeaSketch

Once you've deployed your project, you will find a file called `cdk.outputs` which contains the URL to the service manifest for your project.

```json
"restApiUrl": "https://xxxyyyyzzz.execute-api.us-west-2.amazonaws.com/prod/",
```

Now follow the [SeaSketch instructions](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes) to assign services to each of your sketch classes.

If your sketch class is a Polygon or other feature type, you should assign it both a preprocessing function (for clipping) and a report client.  If you installed the `ocean-eez` starter template then your preprocessor is called `clipToOceanEez` and report client is named `MpaTabReport`.

If your sketch class is a collection then you only need to assign it a report client.  Since we build report clients that work on both individual sketches and sketch collections, you can assign the same report client to your collection as you assigned to your individual sketch class(es).

This should give you the sense that you can create different report clients for different sketch classes within the same project.  Or even make reports for sketch collections completely different from reports for individual sketches.

# Debugging

## Debugging Unit Tests

Each project you create includes a debug launcher which is useful for debugging your function.  With the geoprocessing repo checked out and open in VSCode, just add a breakpoint or a `debugger` call in one of your tests or in one of your functions, click the `Debug` menu in the left toolbar (picture of a bug) and select the appropriate package.  The debugger should break at the appropriate place.

# Upgrading

When you create a geoprocessing project, it will be pinned to a specific version of the geoprocessing library in package.json.  You can update to the latest by running:

```bash
npm update @seasketch/geoprocessing@latest
```

# Subdividing Large Datasets

If you have very large polygon datasets (think country or global data) with very large complex polygon, the standard data import process which uses flatgeobuf, may not be sufficient.  An alternative is to use a `VectorDataSource` specially created by SeaSketch.  It's based on a method described by Paul Ramsey in [this article](https://blog.cleverelephant.ca/2019/11/subdivide.html) of [subdividing](https://postgis.net/docs/ST_Subdivide.html) your data, cutting it up along the boundaries of a spatial index.

Once the polygons have been subdivided, they can be put into small files encoded in the geobuf format, and a lookup table created for the index.  This entire bundle can be then put into S3 cloud storage.

![subdivision process](https://user-images.githubusercontent.com/511063/79161015-a0375e80-7d8f-11ea-87a9-0658777f2f90.jpg)

The magic comes in being able to request polygons from this bundle in our geoprocessing functions.  A `VectorDataSource` class is available that lets us request only the polygon chunks from our subdivided bundle that overlap with the bounding box of our sketch that we are currently analyzing. It even caches request results locally so that subsequent requests do not call out to the network if needed.

`VectorDataSource` can also rebuild the polygon chunks back into the original polygons they came from.  Imagine you've subdivide a dataset of country boundary polygons for the entire world.  You've subdivided them, and now you can reconstruct them back into country polygons.  You simply need to maintain an attribute with your polygons that uniquely identifies how they should be reconstructed.  This could be a `countryCode` or just a non-specific `gid`.

Here is an example of use end-to-end.  Note this is quite a manual process.  Future framework versions may try to automate it.

* [data prep script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-prep.sh) which can be run from the docker workspace using `npm run workspace:shell`, which includes postgis, and mounts your local files in the data directory into the container.
* [sql subdivide script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union.sql) run by the data prep script
* [publish script](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-publish.sh) brings the subdivided polygons out of postgis, encodes them in geobuf format, builds the index, and publishes it all to a standalone S3 bucket that is independent of your project.  The url of the S3 bucket will be provided once complete.  You can ``--dry-run` the command to see how many bundles it will create and how big they'll be.  The sweet spot is bundles about ~25KB in size.  Once you've found that sweet spot you can do the actual run.
* [use of VectorDataSource in gp function](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/src/functions/clipToOceanEez.ts#L32)

This is the method that is used for the global `land` and `eez` datasources. Here is a full example of subdividing OpenStreetMap land polygons for the entire world.  This is what is used for the `clipToOceanEez` script that comes with the `ocean-eez` starter template.

* [publish vector data source](https://github.com/mcclintock-lab/hawaii-reports-next/blob/main/data/eez-land-union-publish.sh)

# Use docker geoprocessing workspace

To open a command in the geoprocessing workspace:

```bash
npm run workspace:shell
```

This will start the `gp-workspace` Docker container and open a terminal window that you can interact with.
It will also start a PostgreSQL database container. You can access this database using the `psql` command (no args) within the workspace, or from the host computer (such as using QGIS) on port 54320 using the credentials found in `data/docker-compose.yml`.

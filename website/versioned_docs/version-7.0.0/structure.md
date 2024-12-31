# Project Structure

## Configuration Files and Scripts

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
  - `geographies.json` - contains one or more planning geographies for your project. If you chose to start with a blank project template, you will have a default geography of the entire world. If you chose to start with the Ocean EEZ template, you will have a default geography that is the EEZ you chose at creation time. Geographies must be manually added/edited in this file. You will then want to re-run `precalc` and `test` to process the changes and make sure they are working as expected. Learn more about [geographies](./concepts/Concepts.md#geographies)
  - `datasources.json` - contains an array of one or more registered datasources, which can be global (url) or local (file path), with a format of vector or raster or subdivided. Global datasources can be manually added/edited in this file, but local datasources should use the [import](./dataimport.md) process. After import, datasources can be manually added/edited in this file. You will then want to run `reimport:data`, `precalc:data`, `precalc:clean`, and `test` to process the changes and make sure they are working as expected. Learn more about [datasources](./concepts/Concepts.md#datasources)
  - `metrics.json` - contains an array of one or more metric groups. Each group defines a metric to calculate, with one or more data classes, derived from one or more datasources, measuring progress towards a planning objective. An initial boundaryAreaOverlap metric group is included in the file by default that uses the global eez datasource. Learn more about [metrics](./concepts/Concepts.md#metrics)
  - `objectives.json` - contains an array of one or more objectives for your planning process. A default objective is included for protection of `20%` of the EEZ. Objectives must be manually added/edited in this file. Learn more about [objectives](./concepts/Concepts.md#objectives)
  - `precalc.json` - contains precalculated metrics for combinations of geographies and datasources. Specifically it calculates for example the total area/count/sum of the portion of a datasources features that overlap with each geography. This file should not be manually edited. If you have custome metrics/precalculations to do, then use a separate file. Learn more about the [precalc](./precalc.md) command.

The object structure in many of the JSON files, particularly the `project` folder, follow strict naming and structure (schema) that must be maintained or you will get validation errors when running commands. Adding additional undocumented properties may be possible, but is not tested. The schemas are defined here:

- [Basic](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/projectBasic.ts)
- [Geographies](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/geography.ts)
- [Datasources](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/datasource.ts)
- [MetricGroup](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/metricGroup.ts)
  - [DataClass](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/dataclass.ts)
- [Objective](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/objective.ts)
- [Precalc Metrics](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/metrics.ts)

## Project Assets

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

## Other Files

- `node_modules` - contains all of the npm installed third-party code dependencies defined in package.json
- `README.md` - default readme file that becomes the published front page of your repo on github.com. Edit this with information to help your users understand your project. It could include information or sources on metric calculations and more.
- `package-lock.json` - contains [cached metadata](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json) on the 3rd party modules you have installed. Updates to this file are made automatically and you should commit the changes to your repository at the same time as changes to your package.json.
- `.nvmrc` - a lesser used config file that works with nvm to define the node version to use for this project. If you use nvm to manage your node version as suggested then you can run `nvm use` in your project and it will install and switch to this version of node.

To learn more, check out the [Architecture](./architecture/Architecture.md) page

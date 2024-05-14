# Migration Guide

Instructions to migrate existing geoprocessing projects to next version.

[NPM](https://www.npmjs.com/package/@seasketch/geoprocessing) is the source of truth for each version.

When you create a geoprocessing project, it will be pinned to a specific version of the geoprocessing library in package.json. If all you need to do is update to the latest version you can run:

```bash
npm update @seasketch/geoprocessing@latest
```

But in many cases you will need to do some manual migration steps

## 6.x to 7.x

Numerous updates are required, including a number of breaking changes.  See the fsm-reports [conversion] for a complete example.

Notable changes:
- Testing framework switched from Jest to Vite
- Use of new Node features (e.g. switch from __dirname to import.meta.dirname)
- Switch to ES Module structure requiring code modifications

### Upgrade dev environment

If you're using `geoprocessing-devcontainer` to develop in a Docker environment, you will need to update this repo and the underlying `geoprocessing-workspace` docker image to the latest.  First, make sure Docker Desktop is running, then:

```bash
cd geoprocessing-devcontainer
git pull
docker pull seasketch/geoprocessing-workspace
```

You should now be able to start a Docker container shell using the latest image and test that everything is up to date

```bash
sudo docker run -it --entrypoint /bin/bash seasketch/geoprocessing-workspace

(base) vscode ➜ / $ node -v
v20.12.1
(base) vscode ➜ / $ npm -v
10.5.0
(base) vscode ➜ / $ gdalinfo --version
GDAL 3.8.5, released 2024/04/02
```

Exit back out of this shell when done

The latest version of the `geoprocessing-workspace` will only work with geoprocessing 7.x projects.  This is due to a change in how GDAL produces flatgeobuf files.  If you suddenly see errors of `"Not a FlatGeobuf file"` when trying to read your file, this is likely the reason. In order to continue to develop older 6.x and lower geoprocessing projects you will need to start your devcontainer using the `local-dev-pre-7x` environment.  This is pinned to an older version of the docker image - `seasketch/geoprocessing-workspace:sha-69bb889`

If you're maintaining your own development environment then you should look to have at least the following versions at minimum:
- Node 20.12.1
- NPM 10.5.0
- GDAL 3.5.0

### Upgrade project dependencies

- Upgrade geoprocessing library to the latest 7.x version found on [NPM](https://www.npmjs.com/package/@seasketch/geoprocessing)
- In your project source codes package.json, review and update `scripts`, `dependencies` and `devDependencies` using [base-project](https://github.com/seasketch/geoprocessing/blob/dev/packages/base-project/package.json) as a guide. Using anything other than the exact version of dependencies found in base-project may have unexpected results.
- Run `npm install`

### Upgrade package scripts

- Update scripts object to the following:

```json
{
  "scripts": {
    "start-data": "http-server data/dist -c-1",
    "__test": "TEST_ROOT=$(pwd) geoprocessing test",
    "test": "start-server-and-test start-data 8080 'npm run __test'",
    "test:matching": "npm run __test -- -t",
    "add:template": "geoprocessing add:template",
    "import:data": "geoprocessing import:data",
    "reimport:data": "geoprocessing reimport:data",
    "precalc:data": "start-server-and-test 'http-server data/dist -c-1 -p 8001' http://localhost:8001 precalc:data_",
    "precalc:data_": "geoprocessing precalc:data",
    "precalc:data:clean": "geoprocessing precalc:data:clean",
    "publish:data": "geoprocessing publish:data",
    "install:scripts": "mkdir -p scripts && cp -r node_modules/@seasketch/geoprocessing/dist/base-project/scripts/* scripts",
    "translation:install": "npx tsx scripts/translationInstall.ts",
    "translation:extract": "npx tsx scripts/translationExtract.ts",
    "translation:publish": "npx tsx src/i18n/bin/publishTerms.ts",
    "translation:import": "npx tsx src/i18n/bin/importTerms.ts",
    "translation:sync": "npm run translation:extract && npm run translation:publish && npm run translation:import",
    "create:function": "geoprocessing create:function",
    "create:client": "geoprocessing create:client",
    "create:report": "geoprocessing create:report",
    "start:client": "geoprocessing start:client",
    "synth": "geoprocessing synth",
    "bootstrap": "geoprocessing bootstrap",
    "deploy": "geoprocessing deploy",
    "destroy": "geoprocessing destroy",
    "build": "geoprocessing build:lambda && geoprocessing build:client",
    "build:client": "geoprocessing build:client",
    "build:lambda": "geoprocessing build:lambda",
    "storybook:install": "npx tsx scripts/storybookInstall.ts",
    "storybook": "geoprocessing storybook",
    "url": "geoprocessing url",
    "clear-results": "geoprocessing clear-results",
    "clear-all-results": "geoprocessing clear-all-results",
    "prepare": "npm run translation:install"
  }
}
```

### Upgrade project scripts

Update the project `scripts` directory.  This includes replacement of source files to be ESM and Node v20 compliant.  If you have customized any of the scripts, you will need to look at the git changes and figure out how to re-merge your work.

`npm run install:scripts`

### Upgrade translations

Update the project `src/i18n` directory.  This includes update of base translations and replacement of source files to be ESM and Node v20 compliant.  Also switches to using Vite for dynamic import of translations using `import.meta.glob`  If you have customized any of the scripts, you will need to look at the git changes and figure out how to re-merge your work.

`npm run translation:install`

### Update tsconfig.json

Change to the following.  This supports use of ES Module (ESM) structure in your project and use of the ESM runtime by the Node instead of Common JS (CJS).  It also ensures that transpiling from Typescript at `build` time produces ESM code.  This means that geoprocessing functions will run as ESM code in the lambdas and report clients as ESM in the browser.  Modern Javascript from end-to-end.  Also imports 3rd party types for Vite and Vitest for use in project.

```javascript
{
  "compilerOptions": {
    "target": "es2022",               /* Specify ECMAScript target version*/
    "module": "nodenext",             /* Specify module code generation */
    "jsx": "react",                   /* Specify JSX code generation */
    "strict": true,                   /* Enable all strict type-checking options. */
    "moduleResolution": "nodenext",   /* Specify module resolution strategy */
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@seasketch/geoprocessing/node_modules/@types",
    ],                                              /* List of folders to include type definitions from. */
    "types": ["vitest/globals", "vite/client"],     /* Type declaration files to be included in compilation. */
    "allowSyntheticDefaultImports": true,           /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "forceConsistentCasingInFileNames": true,       /* Disallow inconsistently-cased references to the same file. */
    "resolveJsonModule": true
  },
  "exclude": ["cdk.out", "node_modules"] /* Files to exclude from compilation */
}
```

### Add Storybook

Storybook is now run using configuration kept in project space.  This is installed with every new project but to add now just run `npm run storybook:install` to install to the `.storybook` directory.  This command should have been added when you updated your package.json file.

### Convert project to ES Modules

This is the biggest breaking change.  You will need to modify your 

In package.json:
- Add `"type": "module",`

Then reload your VSCode window to make sure it picks up that your project is now an "ES Module" project.  You can do this with `Cmd-Shift-P` on Mac or `Ctrl-Shift-P` on Windows and then start typing `reload` and select the `Developer: Reload Window` option.  Or just exit and restart the VSCode app as you normally would.

Now update all of your projects source files to be ESM and Node v20 compliant.  VSCode should give you hints along the way, so basically just click through all the source files looking for red squiggle underlined text.  You will focus in the `src` directory.
  - For each import of a local module (e.g. `import project from ../project`), use a full explicit path and include a `.js` extension on the end, even if you are importing a `.ts` file.  The example would become `import project from ../project/projectClient.js`.
  - NodeJS when using the ES Module engine now requires explicit paths to code files.  No longer can you import a module from a directory (e.g. `import foo from ./my/directory`) and expect it will look for an index.js file.  You have to change this to`import foo form ./my/directory/index.js`.
  `__dirname` built-in must be changed to `import.meta.dirname`

### Migrate asset imports

`require` is no longer allowed for importing images and other static assets.  Vite expects you to import the assets [directly](https://vitejs.dev/guide/assets#importing-asset-as-url) as urls.  SizeCard.tsx is one component installed by default with projects that will need to be updated.

Change:
```typescript
<img
  src={require("../assets/img/territorial_waters.png")}
  style={{ maxWidth: "100%" }}
/>
```
to:
```typescript
import watersImgUrl from "../assets/img/territorial_waters.png";
...
{<img src={watersImgUrl} style={{ maxWidth: "100%" }} />}
```

At this point, VSCode will complain about your image import, it doesn't support importing anything other than code and JSON files by default.  The code bundler now used by your project, Vite, knows how to do this however, you just need to load its capabilities by creating a file called `vite-env.d.ts` at the top-level of your project with the following:

```
/// <reference types="vite/client" />
// Add Vite types to project
// https://vitejs.dev/guide/features.html#client-types
```

### Other Changes

- Change .nvmrc file value to 20
- Rename babel.config.js to babel.config.cjs.  This babel config is used only by the translation library.
- update project/projectClient.ts with type assertion syntax

```typescript
import datasources from "./datasources.json" with { type: "json" };
import metrics from "./metrics.json" with { type: "json" };
import precalc from "./precalc.json" with { type: "json" };
import objectives from "./objectives.json" with { type: "json" };
import geographies from "./geographies.json" with { type: "json" };
import basic from "./basic.json" with { type: "json" };
import projectPackage from "../package.json" with { type: "json" };
import gp from "../geoprocessing.json" with { type: "json" };

import { ProjectClientBase } from "@seasketch/geoprocessing/client-core";

const projectClient = new ProjectClientBase({
  datasources,
  metricGroups: metrics,
  precalc,
  objectives,
  geographies,
  basic,
  package: projectPackage,
  geoprocessing: gp,
});
export default projectClient;
```

### Migrate styled-components

- If you have report components that use styled-components for its styling, you will need to change all code imports of `styled-components` from 
```typescript
import styled from "styled-components"
```
to use of the named export

```typescript
import { styled } from "styled-components"
```

- Also when you run storybook or load your reports in production you may start to see React console warnings about extra attributes being present.

`React does not recognize the rowTotals prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase rowtotals instead. If you accidentally passed it from a parent component, remove it from the DOM element.

The solution is to switch to using `transient` prop names, or component prop names that start with a dollar sign (e.g. `$rowTotals` instead of `rowTotals`).  Styled-components will automatically filter these props out before passing to React to render them as element attributes in the browser.
  - https://jakemccambley.medium.com/transient-props-in-styled-components-3105f16cb91f

# Stop importing directly from @seasketch/geoprocessing in report clients

- Report client code must no longer import from geoprocessing libraries top level entry point `@seasketch/geoprocessing` or you may see a "require is not defined" error or other errors related to Node specific modules not found.  The solution is to switch from for example:
```typescript
import { ProjectClientBase } from "@seasketch/geoprocessing";
```
to:
```typescript
import { ProjectClientBase } from "@seasketch/geoprocessing/client-core";
```

The use of the top-level entry point has persisted in some code because the previous Webpack code bundler did some extra magic to not let Node modules be bundled into report client browser code.  The new Vite code bundler does not do this magic and leaves it to you to track your imports.  The geoprocessing library offers both the `client-core` and `client-ui` entry points which should be used.  These should offer everything you need.

## 6.0 to 6.1

- Run `reimport:data` to ensure that all raster datasources in `data/dist` are in an equal area projection.
- Run `precalc:data` for all raster datasources to precalculate additional metrics including `sum`, `area`, `valid`, `count`.
- Run `publish:data` for all raster datasources to ensure equal area version is published to S3 storage.
- Migrate geoprocessing functions from `otverlapRaster()` (now deprecated) to `rasterMetrics()` as you have time, and need to calculate additional stats like area. `rasterStats()` and `getArea()` are available as lower level alternatives for constructing your own functions.
- any use of geoblaze directly, that passes a polygon feature for overlap, must reproject the feature to an equal area projection first, using `toRasterProjection`. See [getSum](https://github.com/seasketch/geoprocessing/blob/5b2c3dd1381343733e0908d91c22d51597151f1b/packages/geoprocessing/src/toolbox/geoblaze/geoblaze.ts#L34) for an example.
- any use of the deprecated `loadCogWindow()` should be replaced with the newer `loadCog()`. The former doesnt' appear to work correctly with functions like `rasterStats()` and `rasterMetrics()`.

## 5.x to 6.x

- Add `explodeMulti: true` to all vector datasources in `project/datasources.json`. You can set this to false if you know for sure you need to maintain multipolygons in the datasource. Otherwise breaking them up can speed up geoprocessing function by not fetching an operating on extra polygons outside the bounding box of a sketch.

## 4.x to 5.x

### package.json

- Update package.json to latest 5.x version of geoprocessing library and run `npm install`
- Add the `precalc:data` and `precalc:data:clean` cli commands to `package.json`:

```json
{
  "precalc:data": "start-server-and-test 'http-server data/dist -c-1 -p 8001' http://localhost:8001 precalc:data_",
  "precalc:data_": "geoprocessing precalc:data",
  "precalc:data:clean": "geoprocessing precalc:data:clean"
}
```

- Drop use of web server from `import:data` and `reimport:data`

```json
{
  "import:data": "geoprocessing import:data",
  "reimport:data": "geoprocessing reimport:data"
}
```

- The ProjectClient now takes precalc metrics and geographies as input. Update `project/projectClient.ts` to the following:

```typescript
import datasources from "./datasources.json" with { type: "json" };
import metrics from "./metrics.json" with { type: "json" };
import precalc from "./precalc.json" with { type: "json" };
import objectives from "./objectives.json" with { type: "json" };
import geographies from "./geographies.json" with { type: "json" };
import basic from "./basic.json" with { type: "json" };
import projectPackage from "../package.json" with { type: "json" };
import gp from "../geoprocessing.json" with { type: "json" };
import { ProjectClientBase } from "@seasketch/geoprocessing" with { type: "json" };

const projectClient = new ProjectClientBase({
  datasources,
  metricGroups: metrics,
  precalc: precalc,
  objectives,
  geographies,
  basic,
  package: projectPackage,
  geoprocessing: gp,
});

export default projectClient;
```

### Geographies

Geographies are a new construct, most commonly used for planning boundaries. You are required to define at least one per project and you can have more than one. Projects have always had them, but they were implicitly defined based on how data was clipped, which was both unclear to the report developer and very limiting. Geographies are explicit. There is no longer confusion about whether and how to clip datasources to one or more planning boundaries. You just define what the geography boundaries are, by associating it with a datasource. Then the precalc command will clip the datasource (whether vector or raster) to each geographies features (intersection) and precompute metrics with what remains (total area, count, sum). This replaces what was `keyStats` in datasources.json. Preclac metrics are typically used as the denominator when calculating % sketch overlap in reports. Geoprocessing functions also clip the current sketch to one or more geographies at runtime when calculating metrics. These are often used as the numerator when when calculating sketch % overlap in reports.

To setup your projects default geography, create a new file `project/geographies.json`. Choose from one of the options below for your default geography. Just make sure that the geography is assigned to the `default-boundary` group, and `precalc` is set to `true`

1. If you already have a local datasource with your planning boundary, then just define a geography that uses that datasource.

```json
[
  {
    "geographyId": "nearshore",
    "datasourceId": "6nm_boundary",
    "display": "Azores",
    "layerId": "x6kSfK6Lb",
    "groups": ["default-boundary"],
    "precalc": true
  }
]
```

2. If your planning boundary is a Marine Regions EEZ, you can define an `eez` geography that uses the new `global-eez-mr-v12` datasource (see below on how to add this datasource to your project), which is the default for a new project when you choose the Ocean EEZ template. You just need to apply the correct `bboxFilter` and `propertyFilter` for your EEZ or EEZ's of choice. [TODO: ADD WEB LINK]

```json
[
  {
    "geographyId": "eez",
    "datasourceId": "global-eez-mr-v12",
    "display": "Samoan EEZ",
    "propertyFilter": {
      "property": "GEONAME",
      "values": ["Samoan Exclusive Economic Zone"]
    },
    "bboxFilter": [
      -174.51139447157757, -15.878383591829206, -170.54265693017294,
      -10.960825304544073
    ],
    "groups": ["default-boundary"],
    "precalc": true
  }
]
```

3. If you don't have a planning boundary or want to use the entire world as your planning boundary you can use the world geography which uses the world datasource (see below for how to add this datasource). world is the new default geography for all new `blank` geoprocessing projects.

```json
[
  {
    "geographyId": "world",
    "datasourceId": "world",
    "display": "World",
    "groups": ["default-boundary"],
    "precalc": true
  }
]
```

### Datasources

Based on your geography choice above, add the corresponding datasource for this geography to your `datasources.json` file.

World datasource published by [global-datasources](https://github.com/seasketch/global-datasources):

```json
[
  {
    "datasourceId": "world",
    "geo_type": "vector",
    "formats": ["json", "fgb"],
    "layerName": "world",
    "classKeys": [],
    "url": "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/world.fgb",
    "propertiesToKeep": [],
    "metadata": {
      "name": "World Outline Polygon",
      "description": "World polygon for default project geography in seasketch geoprocessing proejcts",
      "version": "1.0",
      "publisher": "SeaSketch",
      "publishDate": "20231018",
      "publishLink": ""
    },
    "precalc": false
  }
]
```

Global EEZ datasource published by [global-datasources](https://github.com/seasketch/global-datasources) (with filters set to for Samoa EEZ)

```json
[
  {
    "datasourceId": "global-eez-mr-v12",
    "geo_type": "vector",
    "formats": ["fgb", "json"],
    "metadata": {
      "name": "World EEZ v11",
      "description": "World EEZ boundaries and disputed areas",
      "version": "11.0",
      "publisher": "Flanders Marine Institute (VLIZ)",
      "publishDate": "2019118",
      "publishLink": "https://marineregions.org/"
    },
    "idProperty": "GEONAME",
    "nameProperty": "GEONAME",
    "classKeys": [],
    "url": "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/global-eez-mr-v12.fgb",
    "propertyFilter": {
      "property": "GEONAME",
      "values": ["Samoan Exclusive Economic Zone"]
    },
    "bboxFilter": [
      -174.51139447157757, -15.878383591829206, -170.54265693017294,
      -10.960825304544073
    ],
    "precalc": false
  }
]
```

Finally, you need to add a `precalc` setting to all other datasources in your `datasources.json` file. This property is required, and you will see validation errors when running any data commands or smoke tests.

- Add `"precalc": true` to all datasources in `project/datasources.json` that metrics should be precalculated for. This is typically limited to datasources that you need to precalc the overall summary metric of the datasource (total area, total feature count) so that you can report the % of the total that a sketch overlaps with. Otherwise you don't need to precalc.
- Set all other datasources to `"precalc": false`. This includes global datasources or datasources that are only a source for `geography` features and otherwise aren't used in reports. Setting these to true will at best just precalculate extra metrics that won't be used. At worst it will try to fetch entire global datasources and fail at the task, because the necessary filters aren't in place.

### Precalc

Once you have your `geographies` and `datasources` properly configured, you're ready to run the `precalc:data` command.

- Create a new file `project/precalc.json` populated with an empty array `[]`

```bash
npm run precalc:data
```

This will precompute metrics for all combinations of geographies and datasources. It will also strip any existing `keyStats` properties from `datasources.json` and populate `precalc.json`.

### Geoprocessing functions

- Update `clipToGeography` function, to allow geographies to use external datasources. To copy the file from the gp library to your project space, run the following from a terminal in the top-level of your project.

```
mkdir -p src/util && cp -r node_modules/@seasketch/geoprocessing/dist/base-project/src/util/clipToGeography.ts src/util/clipToGeography.ts
```

- update all geoprocessing functions to use the following boilerplate:
  - look for `geographyIds` passed in extraParams
  - get the geography using project client and fallback to default geography
  - clip the current sketch to the geography
  - see [azores-nearshore-reports](https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/functions/geomorphAreaOverlap.ts#L30) for examples.

### Report Clients

Reports clients should migrate to new boilerplate code. See [azores-nearshore-reports](https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/components/Geomorphology.tsx#L35) for examples, specifically:

- receive the current geography as a `geographyId` passed in props.
- get the current geography using `project.getGeographyById`.
- pass geographyId to `project.getPrecalcMetrics()`
- pass geographyId to ResultsCard as `extraParams` for gp function to use
- use curGeography.display string as appropriate in client to tell user which geography is being reported on.
- Update any calls to `toPercentMetric()`, now overriding metricIds are passed in through an object, instead of directly. (i.e. `toPercentMetric(singleMetrics, precalcMetrics, project.getMetricGroupPercId(metricGroup)` becomes `toPercentMetric(singleMetrics, precalcMetrics, {metricIdOverride: project.getMetricGroupPercId(metricGroup)})`)

If you would like to allow the user to switch between planning geographies from the report UI, you can add a `GeographySwitcher` at the top level of the report client (see [azores-nearshore-reports](https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/clients/MpaTabReport.tsx#L34) example). The user chosen geography ID is then passed into each `ResultsCard` and on to each geoprocessing function as `extraParams`

### Language Translation

- Geography display names in geographies.json are now extracted with `npm run extract:translations`. Then translate these strings per your current workflow and GeographySwitcher will use them automatically. The same is true for objectives.json and metrics.json.
- Update src/i18n/i18nAsync.ts to latest. Copy the following file in the gp library to your project space to overwrite.

```
cp -r node_modules/@seasketch/geoprocessing/dist/base-project/src/i18n/i18nAsync.ts src/i18n/i18nAsync.ts
```

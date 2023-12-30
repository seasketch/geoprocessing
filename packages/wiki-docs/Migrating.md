# Migration Guide

Instructions to migrate existing geoprocessing projects to next version.

[NPM](https://www.npmjs.com/package/@seasketch/geoprocessing) is the source of truth for each version.

## 6.0 to 6.1

- Run `reimport:data` to ensure that all raster datasources in `data/dist` are in an equal area projection.
- Run `precalc:data` for all raster datasources to precalculate additional metrics including `sum`, `area`, `valid`, `count`.
- Run `publish:data` for all raster datasources to ensure equal area version is published to S3 storage.
- Migrate geoprocessing functions from `overlapRaster()` (now deprecated) to `rasterMetrics()` as you have time, and need to calculate additional stats like area.  `rasterStats()` and `getArea()` are available as lower level alternatives for constructing your own functions.
- any use of geoblaze directly, that passes a polygon feature for overlap, must reproject the feature to an equal area projection first, using `toRasterProjection`.  See [getSum](https://github.com/seasketch/geoprocessing/blob/5b2c3dd1381343733e0908d91c22d51597151f1b/packages/geoprocessing/src/toolbox/geoblaze/geoblaze.ts#L34) for an example.
- any use of the deprecated `loadCogWindow()` should be replaced with the newer `loadCog()`.  The former doesnt' appear to work correctly with functions like `rasterStats()` and `rasterMetrics()`.

## 5.x to 6.x

- Add `explodeMulti: true` to all vector datasources in `project/datasources.json`.  You can set this to false if you know for sure you need to maintain multipolygons in the datasource.  Otherwise breaking them up can speed up geoprocessing function by not fetching an operating on extra polygons outside the bounding box of a sketch.

## 4.x to 5.x

### package.json

- Update package.json to latest 5.x version of geoprocessing library and run `npm install`
- Add the `precalc:data` and `precalc:data:clean` cli commands to `package.json`:
```json
{
    "precalc:data": "start-server-and-test 'http-server data/dist -c-1 -p 8001' http://localhost:8001 precalc:data_",
    "precalc:data_": "geoprocessing precalc:data",
    "precalc:data:clean": "geoprocessing precalc:data:clean",
}
```

- Drop use of web server from `import:data` and `reimport:data`
```json
{
    "import:data": "geoprocessing import:data",
    "reimport:data": "geoprocessing reimport:data",
}
```
- The ProjectClient now takes precalc metrics and geographies as input. Update `project/projectClient.ts` to the following:

```typescript
import datasources from "./datasources.json";
import metrics from "./metrics.json";
import precalc from "./precalc.json";
import objectives from "./objectives.json";
import geographies from "./geographies.json";
import basic from "./basic.json";
import projectPackage from "../package.json";
import gp from "../geoprocessing.json";
import { ProjectClientBase } from "@seasketch/geoprocessing";

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

Geographies are a new construct, most commonly used for planning boundaries. You are required to define at least one per project and you can have more than one. Projects have always had them, but they were implicitly defined based on how data was clipped, which was both unclear to the report developer and very limiting.  Geographies are explicit. There is no longer confusion about whether and how to clip datasources to one or more planning boundaries.  You just define what the geography boundaries are, by associating it with a datasource.  Then the precalc command will clip the datasource (whether vector or raster) to each geographies features (intersection) and precompute metrics with what remains (total area, count, sum).  This replaces what was `keyStats` in datasources.json.  Preclac metrics are typically used as the denominator when calculating % sketch overlap in reports.  Geoprocessing functions also clip the current sketch to one or more geographies at runtime when calculating metrics.  These are often used as the numerator when when calculating sketch % overlap in reports.

To setup your projects default geography, create a new file `project/geographies.json`.  Choose from one of the options below for your default geography.  Just make sure that the geography is assigned to the `default-boundary` group, and `precalc` is set to `true`

1. If you already have a local datasource with your planning boundary, then just define a geography that uses that datasource.  

```json
[{
  "geographyId": "nearshore",
  "datasourceId": "6nm_boundary",
  "display": "Azores",
  "layerId":"x6kSfK6Lb",
  "groups": ["default-boundary"],
  "precalc": true
}]
```

2. If your planning boundary is a Marine Regions EEZ, you can define an `eez` geography that uses the new `global-eez-mr-v12` datasource (see below on how to add this datasource to your project), which is the default for a new project when you choose the Ocean EEZ template.  You just need to apply the correct `bboxFilter` and `propertyFilter` for your EEZ or EEZ's of choice. [TODO: ADD WEB LINK]

```json
[{
  "geographyId": "eez",
  "datasourceId": "global-eez-mr-v12",
  "display": "Samoan EEZ",
  "propertyFilter": {
    "property": "GEONAME",
    "values": [
      "Samoan Exclusive Economic Zone"
    ]
  },
  "bboxFilter": [
    -174.51139447157757,
    -15.878383591829206,
    -170.54265693017294,
    -10.960825304544073
  ],
  "groups": [
    "default-boundary"
  ],
  "precalc": true
}]
```

3. If you don't have a planning boundary or want to use the entire world as your planning boundary you can use the world geography which uses the world datasource (see below for how to add this datasource). world is the new default geography for all new `blank` geoprocessing projects.


```json
[{
  "geographyId": "world",
  "datasourceId": "world",
  "display": "World",
  "groups": ["default-boundary"],
  "precalc": true
}]
```

### Datasources

Based on your geography choice above, add the corresponding datasource for this geography to your `datasources.json` file.

World datasource published by [global-datasources](https://github.com/seasketch/global-datasources):
```json
[{
    "datasourceId": "world",
    "geo_type": "vector",
    "formats": [
      "json", "fgb"
    ],
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
  }]
```

Global EEZ datasource  published by [global-datasources](https://github.com/seasketch/global-datasources) (with filters set to for Samoa EEZ)

```json
[{
    "datasourceId": "global-eez-mr-v12",
    "geo_type": "vector",
    "formats": [
      "fgb",
      "json"
    ],
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
      "values": [
        "Samoan Exclusive Economic Zone"
      ]
    },
    "bboxFilter": [
      -174.51139447157757,
      -15.878383591829206,
      -170.54265693017294,
      -10.960825304544073
    ],
    "precalc": false,
  }]
```


Finally, you need to add a `precalc` setting to all other datasources in your `datasources.json` file.  This property is required, and you will see validation errors when running any data commands or smoke tests.

- Add `"precalc": true` to all datasources in `project/datasources.json` that metrics should be precalculated for.  This is typically limited to datasources that you need to precalc the overall summary metric of the datasource (total area, total feature count) so that you can report the % of the total that a sketch overlaps with.  Otherwise you don't need to precalc.
- Set all other datasources to `"precalc": false`.  This includes global datasources or datasources that are only a source for `geography` features and otherwise aren't used in reports.  Setting these to true will at best just precalculate extra metrics that won't be used.  At worst it will try to fetch entire global datasources and fail at the task, because the necessary filters aren't in place.

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

Reports clients should migrate to new boilerplate code.  See [azores-nearshore-reports](https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/components/Geomorphology.tsx#L35) for examples, specifically:

- receive the current geography as a `geographyId` passed in props. 
- get the current geography using `project.getGeographyById`.
- pass geographyId to `project.getPrecalcMetrics()`
- pass geographyId to ResultsCard as `extraParams` for gp function to use
- use curGeography.display string as appropriate in client to tell user which geography is being reported on.
- Update any calls to `toPercentMetric()`, now overriding metricIds are passed in through an object, instead of directly. (i.e. `toPercentMetric(singleMetrics, precalcMetrics, project.getMetricGroupPercId(metricGroup)` becomes `toPercentMetric(singleMetrics, precalcMetrics, {metricIdOverride: project.getMetricGroupPercId(metricGroup)})`)

If you would like to allow the user to switch between planning geographies from the report UI, you can add a `GeographySwitcher` at the top level of the report client (see [azores-nearshore-reports](https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/clients/MpaTabReport.tsx#L34) example).  The user chosen geography ID is then passed into each `ResultsCard` and on to each geoprocessing function as `extraParams`

### Language Translation

- Geography display names in geographies.json are now extracted with `npm run extract:translations`.  Then translate these strings per your current workflow and GeographySwitcher will use them automatically.  The same is true for objectives.json and metrics.json.
- Update src/i18n/i18nAsync.ts to latest. Copy the following file in the gp library to your project space to overwrite.
```
cp -r node_modules/@seasketch/geoprocessing/dist/base-project/src/i18n/i18nAsync.ts src/i18n/i18nAsync.ts
```
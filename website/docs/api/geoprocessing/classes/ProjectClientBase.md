# ProjectClientBase

Client for reading project configuration/metadata.

## Implements

- [`ProjectClientInterface`](../interfaces/ProjectClientInterface.md)

## Accessors

### basic

```ts
get basic(): object
```

Returns typed config from project.json

#### Returns

`object`

##### bbox

```ts
bbox: [number, number, number, number] | [number, number, number, number, number, number] = bboxSchema;
```

##### externalLinks

```ts
externalLinks: Record<string, string>;
```

##### languages

```ts
languages: string[];
```

##### planningAreaId

```ts
planningAreaId: string;
```

##### planningAreaName

```ts
planningAreaName: string;
```

##### planningAreaType

```ts
planningAreaType: "eez" | "other" = planningAreaTypesSchema;
```

***

### datasources

```ts
get datasources(): (object | object | object & object | object & object)[]
```

Returns typed config from datasources.json

#### Returns

(`object` \| `object` \| `object` & `object` \| `object` & `object`)[]

***

### externalDatasources

```ts
get externalDatasources(): (object | object | object & object | object & object)[]
```

Return external datasources from datasources.json

#### Returns

(`object` \| `object` \| `object` & `object` \| `object` & `object`)[]

***

### geographies

```ts
get geographies(): object[]
```

Returns typed config from geographies.json

#### Returns

`object`[]

***

### geoprocessing

```ts
get geoprocessing(): object
```

Returns typed config from geoprocessing.json

#### Returns

`object`

##### author

```ts
author: string;
```

##### clients

```ts
clients: object[];
```

##### geoprocessingFunctions

```ts
geoprocessingFunctions: string[];
```

##### organization?

```ts
optional organization: string;
```

##### preprocessingFunctions

```ts
preprocessingFunctions: string[];
```

##### region

```ts
region: string;
```

***

### internalDatasources

```ts
get internalDatasources(): (object | object | object & object | object & object)[]
```

Returns internal datasources from datasources.json

#### Returns

(`object` \| `object` \| `object` & `object` \| `object` & `object`)[]

***

### metricGroups

```ts
get metricGroups(): object[]
```

Returns typed config from metrics.json

#### Returns

`object`[]

***

### objectives

```ts
get objectives(): object[]
```

Returns typed config from objectives.json

#### Returns

`object`[]

***

### package

```ts
get package(): object
```

Returns typed config from package.json

#### Returns

`object`

##### author

```ts
author: string;
```

##### bugs?

```ts
optional bugs: Record<string, string>;
```

##### dependencies?

```ts
optional dependencies: Record<string, string>;
```

##### description

```ts
description: string;
```

##### devDependencies?

```ts
optional devDependencies: Record<string, string>;
```

##### homepage?

```ts
optional homepage: string;
```

##### keywords?

```ts
optional keywords: string[];
```

##### license

```ts
license: string;
```

##### name

```ts
name: string;
```

##### private?

```ts
optional private: boolean;
```

##### repository?

```ts
optional repository: Record<string, string>;
```

##### repositoryUrl?

```ts
optional repositoryUrl: string;
```

##### scripts?

```ts
optional scripts: Record<string, string>;
```

##### type?

```ts
optional type: string;
```

##### version

```ts
version: string;
```

***

### precalc

```ts
get precalc(): object[]
```

Returns precalculated metrics from precalc.json

#### Returns

`object`[]

## Constructors

### new ProjectClientBase()

```ts
new ProjectClientBase(config): ProjectClientBase
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ProjectClientConfig`](../interfaces/ProjectClientConfig.md) |

#### Returns

[`ProjectClientBase`](ProjectClientBase.md)

## Methods

### dataBucketUrl()

```ts
dataBucketUrl(options): string
```

Returns URL to dataset bucket for project.  In test environment or if local parameter is true, will
return local URL expected to serve up dist data folder

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `DataBucketUrlOptions` |

#### Returns

`string`

#### Implementation of

[`ProjectClientInterface`](../interfaces/ProjectClientInterface.md).[`dataBucketUrl`](../interfaces/ProjectClientInterface.md#databucketurl)

***

### getDatasourceById()

```ts
getDatasourceById(datasourceId): object | object | object & object | object & object
```

Returns Datasource given datasourceId

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object` \| `object` \| `object` & `object` \| `object` & `object`

#### Implementation of

[`ProjectClientInterface`](../interfaces/ProjectClientInterface.md).[`getDatasourceById`](../interfaces/ProjectClientInterface.md#getdatasourcebyid)

***

### getDatasourceUrl()

```ts
getDatasourceUrl(ds, options): string
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ds` | \| `object` \| `object` \| `object` \| `object` \| `object` & `object` \| `object` & `object` \| [`ImportVectorDatasourceConfig`](../type-aliases/ImportVectorDatasourceConfig.md) \| [`ImportRasterDatasourceConfig`](../type-aliases/ImportRasterDatasourceConfig.md) |
| `options` | `object` |
| `options.format`? | `"fgb"` \| `"json"` \| `"tif"` \| `"subdivided"` |
| `options.local`? | `boolean` |
| `options.port`? | `number` |
| `options.subPath`? | `string` |

#### Returns

`string`

#### Implementation of

[`ProjectClientInterface`](../interfaces/ProjectClientInterface.md).[`getDatasourceUrl`](../interfaces/ProjectClientInterface.md#getdatasourceurl)

***

### getExternalRasterDatasourceById()

```ts
getExternalRasterDatasourceById(datasourceId): object & object
```

Returns ExternalRasterDatasource given datasourceId, throws if not found

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object` & `object`

***

### getExternalVectorDatasourceById()

```ts
getExternalVectorDatasourceById(datasourceId): object & object
```

Returns ExternalVectorDatasource given datasourceId, throws if not found

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object` & `object`

***

### getFgbPath()

```ts
getFgbPath(ds): string
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ds` | \| `object` \| `object` \| `object` \| `object` \| `object` & `object` \| `object` & `object` \| [`ImportVectorDatasourceConfig`](../type-aliases/ImportVectorDatasourceConfig.md) \| [`ImportRasterDatasourceConfig`](../type-aliases/ImportRasterDatasourceConfig.md) |

#### Returns

`string`

***

### getGeographyByGroup()

```ts
getGeographyByGroup(group): object[]
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `group` | `string` | the name of the geography group |

#### Returns

`object`[]

geographies with group name assigned

***

### getGeographyById()

```ts
getGeographyById(geographyId?, options?): object
```

Returns project geography matching the provided ID, with optional fallback geography using fallbackGroup parameter

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `geographyId`? | `string` | The geography ID to search for |
| `options`? | `object` |  |
| `options.fallbackGroup`? | `string` | The default group name to lookup if no geographyId is provided. expects there is only one geography with that group name |

#### Returns

`object`

##### bboxFilter?

```ts
optional bboxFilter: [number, number, number, number] | [number, number, number, number, number, number];
```

Optional, constrain geography to only features within a bounding box

##### datasourceId

```ts
datasourceId: string;
```

ID of datasource containing geography boundary

##### display

```ts
display: string;
```

Display name for the geography

##### geographyId

```ts
geographyId: string;
```

Unique name of the geography

##### groups?

```ts
optional groups: string[];
```

Optional, sub-geography identifier. Useful when you have multiple groupings/levels of geographies and want to select for a specific group

##### layerId?

```ts
optional layerId: string;
```

Optional, defines external layer for visualizing the geography

##### precalc

```ts
precalc: boolean;
```

Optional, defines whether or not precalc should be run for this geography

##### propertyFilter?

```ts
optional propertyFilter: object;
```

Required if external datasource used, defines filter to constrain geography features, matches feature property having one or more specific values

##### propertyFilter.property

```ts
property: string;
```

##### propertyFilter.values

```ts
values: (string | number)[];
```

#### Throws

if geography does not exist

***

### getInternalRasterDatasourceById()

```ts
getInternalRasterDatasourceById(datasourceId): object
```

Returns InternalRasterDatasource given datasourceId, throws if not found

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object`

##### band

```ts
band: number;
```

Import - band within raster datasource to extract

##### created

```ts
created: string;
```

Datasource creation timestamp

##### datasourceId

```ts
datasourceId: string;
```

Unique id of datasource in project

##### formats

```ts
formats: ("fgb" | "json" | "tif" | "subdivided")[];
```

Available formats

##### geo\_type

```ts
geo_type: "vector" | "raster" = geoTypesSchema;
```

basic geospatial type

##### lastUpdated

```ts
lastUpdated: string;
```

Datasource updated timestamp

##### measurementType

```ts
measurementType: "quantitative" | "categorical" = measurementTypesSchema;
```

Type of measurements that the raster values represent

##### metadata?

```ts
optional metadata: object;
```

##### metadata.description?

```ts
optional description: string;
```

Description of datasource

##### metadata.name

```ts
name: string;
```

Human-readable name of datasource

##### metadata.publishDate

```ts
publishDate: string;
```

ISO 8601 publish date

##### metadata.publisher

```ts
publisher: string;
```

Publisher name

##### metadata.publishLink

```ts
publishLink: string;
```

Public URL to access published data

##### metadata.version

```ts
version: string;
```

Publisher-provided version number or ISO 8601 date

##### noDataValue?

```ts
optional noDataValue: number;
```

Nodata value

##### precalc

```ts
precalc: boolean;
```

Optional, defines whether or not precalc should be run for this datasource

##### src

```ts
src: string;
```

Import - Path to source data, with filename

***

### getInternalVectorDatasourceById()

```ts
getInternalVectorDatasourceById(datasourceId): object
```

Returns InternalVectorDatasource given datasourceId, throws if not found

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object`

##### bboxFilter?

```ts
optional bboxFilter: [number, number, number, number] | [number, number, number, number, number, number];
```

Optional, constrain datasource to smaller bbox

##### classKeys

```ts
classKeys: string[];
```

properties whose values define classes of data.

##### created

```ts
created: string;
```

Datasource creation timestamp

##### datasourceId

```ts
datasourceId: string;
```

Unique id of datasource in project

##### explodeMulti

```ts
explodeMulti: boolean;
```

Import - Whether to explode multi-geometries into single e.g. MultiPolygon to Polygon. Defaults to true

##### formats

```ts
formats: ("fgb" | "json" | "tif" | "subdivided")[];
```

Available formats

##### geo\_type

```ts
geo_type: "vector" | "raster" = geoTypesSchema;
```

basic geospatial type

##### idProperty?

```ts
optional idProperty: string;
```

Optional, name of property containing unique ID value for each vector feature

##### lastUpdated

```ts
lastUpdated: string;
```

Datasource updated timestamp

##### layerName?

```ts
optional layerName: string;
```

Import - Name of layer within vector datasource to extract

##### metadata?

```ts
optional metadata: object;
```

##### metadata.description?

```ts
optional description: string;
```

Description of datasource

##### metadata.name

```ts
name: string;
```

Human-readable name of datasource

##### metadata.publishDate

```ts
publishDate: string;
```

ISO 8601 publish date

##### metadata.publisher

```ts
publisher: string;
```

Publisher name

##### metadata.publishLink

```ts
publishLink: string;
```

Public URL to access published data

##### metadata.version

```ts
version: string;
```

Publisher-provided version number or ISO 8601 date

##### nameProperty?

```ts
optional nameProperty: string;
```

Optional, name of property containing name for each vector feature

##### precalc

```ts
precalc: boolean;
```

Optional, defines whether or not precalc should be run for this datasource

##### propertiesToKeep

```ts
propertiesToKeep: string[];
```

Import - What to keep in final dataset. Vector - properties, all else removed

##### propertyFilter?

```ts
optional propertyFilter: object;
```

Optional, constrain datasource features by property having one or more specific values

##### propertyFilter.property

```ts
property: string;
```

##### propertyFilter.values

```ts
values: (string | number)[];
```

##### src

```ts
src: string;
```

Import - Path to source data, with filename

***

### getMetricGroup()

```ts
getMetricGroup(metricId, t?): object
```

Returns MetricGroup given metricId, optional translating display name, given i18n t function

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metricId` | `string` |
| `t`? | `TFunction`\<`"translation"`, `undefined`\> |

#### Returns

`object`

##### classes

```ts
classes: object[];
```

data classes used by group

##### classKey?

```ts
optional classKey: string;
```

Optional datasource class key used to source classIds

##### datasourceId?

```ts
optional datasourceId: string;
```

Datasource to generate metrics from

##### layerId?

```ts
optional layerId: string;
```

Optional ID of map layer associated with this metric

##### metricId

```ts
metricId: string;
```

Unique id of metric in project

##### objectiveId?

```ts
optional objectiveId: string;
```

group level objective, applies to all classes

##### type?

```ts
optional type: string;
```

unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user

***

### getMetricGroupClassKey()

```ts
getMetricGroupClassKey(metricGroup, options): undefined | string
```

Returns classKey for given metric group, class-level if available, otherwise metricGroup level if not

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricGroup` | `object` | metricGroup to search for class and classKey |
| `metricGroup.classes` | `object`[] | data classes used by group |
| `metricGroup.classKey`? | `string` | Optional datasource class key used to source classIds |
| `metricGroup.datasourceId`? | `string` | Datasource to generate metrics from |
| `metricGroup.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `metricGroup.metricId` | `string` | Unique id of metric in project |
| `metricGroup.objectiveId`? | `string` | group level objective, applies to all classes |
| `metricGroup.type`? | `string` | unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user |
| `options` | `object` | - |
| `options.classId`? | `string` | optional data class ID to specifically get classKey for |

#### Returns

`undefined` \| `string`

the classKey name or undefined

#### Throws

if class does not exist in metric group with given classId

***

### getMetricGroupDatasource()

```ts
getMetricGroupDatasource(metricGroup, options): object | object | object & object | object & object
```

Returns datasource for given MetricGroup.
If classId is provided, returns class-level datasource if assigned, otherwise falls back to top-level metricGroup datasource

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricGroup` | `object` | metricGroup to get datasource for |
| `metricGroup.classes` | `object`[] | data classes used by group |
| `metricGroup.classKey`? | `string` | Optional datasource class key used to source classIds |
| `metricGroup.datasourceId`? | `string` | Datasource to generate metrics from |
| `metricGroup.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `metricGroup.metricId` | `string` | Unique id of metric in project |
| `metricGroup.objectiveId`? | `string` | group level objective, applies to all classes |
| `metricGroup.type`? | `string` | unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user |
| `options` | `object` | - |
| `options.classId`? | `string` | metricGroup class to get datasource for |

#### Returns

`object` \| `object` \| `object` & `object` \| `object` & `object`

the datasource object

#### Throws

if class does not exist in metric group with given classId

#### Throws

if datasourceId is missing for metricGroup and class

***

### getMetricGroupObjectives()

```ts
getMetricGroupObjectives(metricGroup, t?): object[]
```

Returns Objectives for MetricGroup
If at least one class has an objective assigned, then it returns those, missing classes with no objective get the top-level objective
If no class-level objectives are found, then it returns the top-level objective
If no objectives are found, returns an empty array
Given i18n t function it will also translate the short description

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricGroup` | `object` |  |
| `metricGroup.classes` | `object`[] | data classes used by group |
| `metricGroup.classKey`? | `string` | Optional datasource class key used to source classIds |
| `metricGroup.datasourceId`? | `string` | Datasource to generate metrics from |
| `metricGroup.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `metricGroup.metricId`? | `string` | Unique id of metric in project |
| `metricGroup.objectiveId`? | `string` | group level objective, applies to all classes |
| `metricGroup.type`? | `string` | unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user |
| `t`? | `TFunction`\<`"translation"`, `undefined`\> |  |

#### Returns

`object`[]

***

### getMetricGroupPercId()

```ts
getMetricGroupPercId(mg): string
```

Simple helper that given MetricGroup, returns a consistent ID string for a percent metric, defaults to metricId + 'Perc' added to the end

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mg` | `object` | the MetricGroup |
| `mg.classes` | `object`[] | data classes used by group |
| `mg.classKey`? | `string` | Optional datasource class key used to source classIds |
| `mg.datasourceId`? | `string` | Datasource to generate metrics from |
| `mg.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `mg.metricId` | `string` | Unique id of metric in project |
| `mg.objectiveId`? | `string` | group level objective, applies to all classes |
| `mg.type`? | `string` | unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user |

#### Returns

`string`

- ID string

***

### getObjectiveById()

```ts
getObjectiveById(objectiveId): object
```

Returns Objective given objectiveId

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `objectiveId` | `string` |

#### Returns

`object`

##### countsToward

```ts
countsToward: Record<string, "yes" | "no" | "maybe"> = objectiveAnswerMapSchema;
```

Generic map of group names (e.g. MPA protection levels) to whether they count towards objective

##### objectiveId

```ts
objectiveId: string;
```

Unique identifier for objective

##### shortDesc

```ts
shortDesc: string;
```

##### target

```ts
target: number;
```

Value required for objective to be met

***

### getPrecalcMetrics()

```ts
getPrecalcMetrics(
   mg?, 
   metricId?, 
   geographyId?): object[]
```

Returns precalc metrics from precalc.json.  Optionally filters down to specific metricGroup and geographyId

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mg`? | `object` | MetricGroup to get precalculated metrics for |
| `mg.classes`? | `object`[] | data classes used by group |
| `mg.classKey`? | `string` | Optional datasource class key used to source classIds |
| `mg.datasourceId`? | `string` | Datasource to generate metrics from |
| `mg.layerId`? | `string` | Optional ID of map layer associated with this metric |
| `mg.metricId`? | `string` | Unique id of metric in project |
| `mg.objectiveId`? | `string` | group level objective, applies to all classes |
| `mg.type`? | `string` | unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user |
| `metricId`? | `string` | string, "area", "count", or "sum" |
| `geographyId`? | `string` | string, geographyId to get precalculated metrics for |

#### Returns

`object`[]

Metric[] of precalculated metrics

***

### getRasterDatasourceById()

```ts
getRasterDatasourceById(datasourceId): object
```

Returns RasterDatasource given datasourceId, throws if not found

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object`

##### band

```ts
band: number;
```

Import - band within raster datasource to extract

##### datasourceId

```ts
datasourceId: string;
```

Unique id of datasource in project

##### formats

```ts
formats: ("fgb" | "json" | "tif" | "subdivided")[];
```

Available formats

##### geo\_type

```ts
geo_type: "vector" | "raster" = geoTypesSchema;
```

basic geospatial type

##### measurementType

```ts
measurementType: "quantitative" | "categorical" = measurementTypesSchema;
```

Type of measurements that the raster values represent

##### metadata?

```ts
optional metadata: object;
```

##### metadata.description?

```ts
optional description: string;
```

Description of datasource

##### metadata.name

```ts
name: string;
```

Human-readable name of datasource

##### metadata.publishDate

```ts
publishDate: string;
```

ISO 8601 publish date

##### metadata.publisher

```ts
publisher: string;
```

Publisher name

##### metadata.publishLink

```ts
publishLink: string;
```

Public URL to access published data

##### metadata.version

```ts
version: string;
```

Publisher-provided version number or ISO 8601 date

##### noDataValue?

```ts
optional noDataValue: number;
```

Nodata value

##### precalc

```ts
precalc: boolean;
```

Optional, defines whether or not precalc should be run for this datasource

#### Implementation of

[`ProjectClientInterface`](../interfaces/ProjectClientInterface.md).[`getRasterDatasourceById`](../interfaces/ProjectClientInterface.md#getrasterdatasourcebyid)

***

### getVectorDatasourceById()

```ts
getVectorDatasourceById(datasourceId): object
```

Returns VectorDatasource given datasourceId, throws if not found

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object`

##### bboxFilter?

```ts
optional bboxFilter: [number, number, number, number] | [number, number, number, number, number, number];
```

Optional, constrain datasource to smaller bbox

##### classKeys

```ts
classKeys: string[];
```

properties whose values define classes of data.

##### datasourceId

```ts
datasourceId: string;
```

Unique id of datasource in project

##### formats

```ts
formats: ("fgb" | "json" | "tif" | "subdivided")[];
```

Available formats

##### geo\_type

```ts
geo_type: "vector" | "raster" = geoTypesSchema;
```

basic geospatial type

##### idProperty?

```ts
optional idProperty: string;
```

Optional, name of property containing unique ID value for each vector feature

##### layerName?

```ts
optional layerName: string;
```

Import - Name of layer within vector datasource to extract

##### metadata?

```ts
optional metadata: object;
```

##### metadata.description?

```ts
optional description: string;
```

Description of datasource

##### metadata.name

```ts
name: string;
```

Human-readable name of datasource

##### metadata.publishDate

```ts
publishDate: string;
```

ISO 8601 publish date

##### metadata.publisher

```ts
publisher: string;
```

Publisher name

##### metadata.publishLink

```ts
publishLink: string;
```

Public URL to access published data

##### metadata.version

```ts
version: string;
```

Publisher-provided version number or ISO 8601 date

##### nameProperty?

```ts
optional nameProperty: string;
```

Optional, name of property containing name for each vector feature

##### precalc

```ts
precalc: boolean;
```

Optional, defines whether or not precalc should be run for this datasource

##### propertyFilter?

```ts
optional propertyFilter: object;
```

Optional, constrain datasource features by property having one or more specific values

##### propertyFilter.property

```ts
property: string;
```

##### propertyFilter.values

```ts
values: (string | number)[];
```

#### Implementation of

[`ProjectClientInterface`](../interfaces/ProjectClientInterface.md).[`getVectorDatasourceById`](../interfaces/ProjectClientInterface.md#getvectordatasourcebyid)

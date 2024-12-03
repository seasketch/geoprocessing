# ProjectClientInterface

## Methods

### dataBucketUrl()

```ts
dataBucketUrl(options): string
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `DataBucketUrlOptions` |

#### Returns

`string`

***

### getDatasourceById()

```ts
getDatasourceById(datasourceId): object | object | object & object | object & object
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |

#### Returns

`object` \| `object` \| `object` & `object` \| `object` & `object`

***

### getDatasourceUrl()

```ts
getDatasourceUrl(ds): any
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ds` | \| `object` \| `object` \| `object` \| `object` \| `object` & `object` \| `object` & `object` \| [`ImportVectorDatasourceConfig`](../type-aliases/ImportVectorDatasourceConfig.md) \| [`ImportRasterDatasourceConfig`](../type-aliases/ImportRasterDatasourceConfig.md) |

#### Returns

`any`

***

### getRasterDatasourceById()

```ts
getRasterDatasourceById(datasourceId): object
```

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

***

### getVectorDatasourceById()

```ts
getVectorDatasourceById(datasourceId): object
```

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

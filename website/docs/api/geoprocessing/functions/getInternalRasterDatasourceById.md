# getInternalRasterDatasourceById()

```ts
function getInternalRasterDatasourceById(datasourceId, datasources): object
```

find and return internal datasource from passed datasources

## Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |
| `datasources` | (`object` \| `object` \| `object` & `object` \| `object` & `object`)[] |

## Returns

`object`

### band

```ts
band: number;
```

Import - band within raster datasource to extract

### created

```ts
created: string;
```

Datasource creation timestamp

### datasourceId

```ts
datasourceId: string;
```

Unique id of datasource in project

### formats

```ts
formats: ("fgb" | "json" | "tif" | "subdivided")[];
```

Available formats

### geo\_type

```ts
geo_type: "vector" | "raster" = geoTypesSchema;
```

basic geospatial type

### lastUpdated

```ts
lastUpdated: string;
```

Datasource updated timestamp

### measurementType

```ts
measurementType: "quantitative" | "categorical" = measurementTypesSchema;
```

Type of measurements that the raster values represent

### metadata?

```ts
optional metadata: object;
```

### metadata.description?

```ts
optional description: string;
```

Description of datasource

### metadata.name

```ts
name: string;
```

Human-readable name of datasource

### metadata.publishDate

```ts
publishDate: string;
```

ISO 8601 publish date

### metadata.publisher

```ts
publisher: string;
```

Publisher name

### metadata.publishLink

```ts
publishLink: string;
```

Public URL to access published data

### metadata.version

```ts
version: string;
```

Publisher-provided version number or ISO 8601 date

### noDataValue?

```ts
optional noDataValue: number;
```

Nodata value

### precalc

```ts
precalc: boolean;
```

Optional, defines whether or not precalc should be run for this datasource

### src

```ts
src: string;
```

Import - Path to source data, with filename

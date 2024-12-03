# getInternalVectorDatasourceById()

```ts
function getInternalVectorDatasourceById(datasourceId, datasources): object
```

find and return internal vector datasource from passed datasources

## Parameters

| Parameter | Type |
| ------ | ------ |
| `datasourceId` | `string` |
| `datasources` | (`object` \| `object` \| `object` & `object` \| `object` & `object`)[] |

## Returns

`object`

### bboxFilter?

```ts
optional bboxFilter: [number, number, number, number] | [number, number, number, number, number, number];
```

Optional, constrain datasource to smaller bbox

### classKeys

```ts
classKeys: string[];
```

properties whose values define classes of data.

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

### explodeMulti

```ts
explodeMulti: boolean;
```

Import - Whether to explode multi-geometries into single e.g. MultiPolygon to Polygon. Defaults to true

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

### idProperty?

```ts
optional idProperty: string;
```

Optional, name of property containing unique ID value for each vector feature

### lastUpdated

```ts
lastUpdated: string;
```

Datasource updated timestamp

### layerName?

```ts
optional layerName: string;
```

Import - Name of layer within vector datasource to extract

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

### nameProperty?

```ts
optional nameProperty: string;
```

Optional, name of property containing name for each vector feature

### precalc

```ts
precalc: boolean;
```

Optional, defines whether or not precalc should be run for this datasource

### propertiesToKeep

```ts
propertiesToKeep: string[];
```

Import - What to keep in final dataset. Vector - properties, all else removed

### propertyFilter?

```ts
optional propertyFilter: object;
```

Optional, constrain datasource features by property having one or more specific values

### propertyFilter.property

```ts
property: string;
```

### propertyFilter.values

```ts
values: (string | number)[];
```

### src

```ts
src: string;
```

Import - Path to source data, with filename

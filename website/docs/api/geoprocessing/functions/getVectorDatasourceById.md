# getVectorDatasourceById()

```ts
function getVectorDatasourceById(datasourceId, datasources): object;
```

find and return vector datasource (internal or external) from passed datasources

## Parameters

| Parameter      | Type                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| `datasourceId` | `string`                                                               |
| `datasources`  | (`object` \| `object` \| `object` & `object` \| `object` & `object`)[] |

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

keys to generate classes for. Vector - property names

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

### geo_type

```ts
geo_type: "vector" | "raster" = geoTypesSchema;
```

basic geospatial type

### idProperty?

```ts
optional idProperty: string;
```

Optional, name of property containing unique ID value for each vector feature

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

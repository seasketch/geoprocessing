# baseDatasourceSchema

```ts
const baseDatasourceSchema: ZodObject<
  object,
  "strip",
  ZodTypeAny,
  object,
  object
>;
```

## Type declaration

### datasourceId

```ts
datasourceId: ZodString;
```

Unique id of datasource in project

### formats

```ts
formats: ZodArray<ZodEnum<["fgb", "json", "tif", "subdivided"]>, "many">;
```

Available formats

### geo_type

```ts
geo_type: ZodEnum<["vector", "raster"]> = geoTypesSchema;
```

basic geospatial type

### metadata

```ts
metadata: ZodOptional<ZodObject<object, "strip", ZodTypeAny, object, object>>;
```

### precalc

```ts
precalc: ZodBoolean;
```

Optional, defines whether or not precalc should be run for this datasource

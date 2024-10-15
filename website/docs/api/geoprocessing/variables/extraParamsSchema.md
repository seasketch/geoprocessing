# extraParamsSchema

```ts
const extraParamsSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Default set of additional parameters that a geoprocessing or preprocessing function can accept
Override or extend as needed with more specific types, and use .parse() function to validate your input

## Type declaration

### eezs

```ts
eezs: ZodOptional<ZodArray<ZodString, "many">>;
```

### geographies

```ts
geographies: ZodOptional<ZodArray<ZodString, "many">>;
```

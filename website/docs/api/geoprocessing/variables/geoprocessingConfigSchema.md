# geoprocessingConfigSchema

```ts
const geoprocessingConfigSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Represents a single JS package

## Type declaration

### author

```ts
author: ZodString;
```

### clients

```ts
clients: ZodArray<ZodObject<object, "strip", ZodTypeAny, object, object>, "many">;
```

### geoprocessingFunctions

```ts
geoprocessingFunctions: ZodArray<ZodString, "many">;
```

### organization

```ts
organization: ZodOptional<ZodString>;
```

### preprocessingFunctions

```ts
preprocessingFunctions: ZodArray<ZodString, "many">;
```

### region

```ts
region: ZodString;
```

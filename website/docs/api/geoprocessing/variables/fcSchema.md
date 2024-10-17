# fcSchema

```ts
const fcSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Zod schema for FeatureCollection containing polygons or multipolygons

## Type declaration

### features

```ts
features: ZodArray<ZodObject<object, "strip", ZodTypeAny, object, object>, "many">;
```

### type

```ts
type: ZodLiteral<"FeatureCollection">;
```

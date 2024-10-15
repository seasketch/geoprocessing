# featureSchema

```ts
const featureSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Zod schema for Feature containing Polygon or MultiPolygon

## Type declaration

### geometry

```ts
geometry: ZodUnion<[ZodObject<object, "strip", ZodTypeAny, object, object>, ZodObject<object, "strip", ZodTypeAny, object, object>]>;
```

### id

```ts
id: ZodOptional<ZodUnion<[ZodString, ZodNumber]>>;
```

### properties

```ts
properties: ZodNullable<ZodUnion<[ZodRecord<ZodString, ZodAny>, ZodNull]>>;
```

### type

```ts
type: ZodLiteral<"Feature">;
```

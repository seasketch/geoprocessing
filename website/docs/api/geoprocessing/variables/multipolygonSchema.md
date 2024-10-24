# multipolygonSchema

```ts
const multipolygonSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

## Type declaration

### coordinates

```ts
coordinates: ZodArray<ZodArray<ZodArray<ZodArray<ZodNumber, "many">, "many">, "many">, "many">;
```

### type

```ts
type: ZodLiteral<"MultiPolygon">;
```
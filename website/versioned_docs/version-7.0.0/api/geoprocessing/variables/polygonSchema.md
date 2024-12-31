# polygonSchema

```ts
const polygonSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

## Type declaration

### coordinates

```ts
coordinates: ZodArray<ZodArray<ZodArray<ZodNumber, "many">, "many">, "many">;
```

### type

```ts
type: ZodLiteral<"Polygon">;
```

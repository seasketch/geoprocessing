# projectSchema

```ts
const projectSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

## Type declaration

### bbox

```ts
bbox: ZodUnion<[ZodTuple<[ZodNumber, ZodNumber, ZodNumber, ZodNumber], null>, ZodTuple<[ZodNumber, ZodNumber, ZodNumber, ZodNumber, ZodNumber, ZodNumber], null>]> = bboxSchema;
```

### externalLinks

```ts
externalLinks: ZodRecord<ZodString, ZodString>;
```

### languages

```ts
languages: ZodArray<ZodString, "many">;
```

### planningAreaId

```ts
planningAreaId: ZodString;
```

### planningAreaName

```ts
planningAreaName: ZodString;
```

### planningAreaType

```ts
planningAreaType: ZodEnum<["eez", "other"]> = planningAreaTypesSchema;
```

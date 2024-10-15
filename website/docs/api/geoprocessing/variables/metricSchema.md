# metricSchema

```ts
const metricSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

## Type declaration

### classId

```ts
classId: ZodNullable<ZodString>;
```

### extra

```ts
extra: ZodOptional<ZodRecord<ZodString, ZodType<JSONValue, ZodTypeDef, JSONValue>>>;
```

### geographyId

```ts
geographyId: ZodNullable<ZodString>;
```

### groupId

```ts
groupId: ZodNullable<ZodString>;
```

### metricId

```ts
metricId: ZodString;
```

### sketchId

```ts
sketchId: ZodNullable<ZodString>;
```

### value

```ts
value: ZodNumber;
```

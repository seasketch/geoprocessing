# objectiveSchema

```ts
const objectiveSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Base planning objective, extend as needed for specific classification system or ad-hoc

## Type declaration

### countsToward

```ts
countsToward: ZodRecord<ZodString, ZodEnum<["yes", "no", "maybe"]>> = objectiveAnswerMapSchema;
```

Generic map of group names (e.g. MPA protection levels) to whether they count towards objective

### objectiveId

```ts
objectiveId: ZodString;
```

Unique identifier for objective

### shortDesc

```ts
shortDesc: ZodString;
```

### target

```ts
target: ZodNumber;
```

Value required for objective to be met

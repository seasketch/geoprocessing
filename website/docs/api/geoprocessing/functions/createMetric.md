# createMetric()

```ts
function createMetric(metric): object;
```

Creates a new metric. Defaults to ID values of null and then copies in passed metric properties

## Parameters

| Parameter | Type                  | Description    |
| --------- | --------------------- | -------------- |
| `metric`  | `Partial`\<`object`\> | partial metric |

## Returns

`object`

metric

### classId

```ts
classId: null | string;
```

### extra?

```ts
optional extra: Record<string, JSONValue>;
```

### geographyId

```ts
geographyId: null | string;
```

### groupId

```ts
groupId: null | string;
```

### metricId

```ts
metricId: string;
```

### sketchId

```ts
sketchId: null | string;
```

### value

```ts
value: number;
```

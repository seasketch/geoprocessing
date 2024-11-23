# metricGroupSchema

```ts
const metricGroupSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;
```

Defines a metric in combination with a datasource, with one or more data classes

## Type declaration

### classes

```ts
classes: ZodArray<ZodObject<object, "strip", ZodTypeAny, object, object>, "many">;
```

data classes used by group

### classKey

```ts
classKey: ZodOptional<ZodString>;
```

Optional datasource class key used to source classIds

### datasourceId

```ts
datasourceId: ZodOptional<ZodString>;
```

Datasource to generate metrics from

### layerId

```ts
layerId: ZodOptional<ZodString>;
```

Optional ID of map layer associated with this metric

### metricId

```ts
metricId: ZodString;
```

Unique id of metric in project

### objectiveId

```ts
objectiveId: ZodOptional<ZodString>;
```

group level objective, applies to all classes

### type

```ts
type: ZodOptional<ZodString>;
```

unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user

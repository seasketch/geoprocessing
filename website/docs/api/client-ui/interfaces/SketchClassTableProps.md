# SketchClassTableProps

## Properties

### formatPerc?

```ts
optional formatPerc: boolean;
```

Whether to format values as percentages, defaults to false

---

### metricGroup

```ts
metricGroup: object;
```

Data class definitions

#### classes

```ts
classes: object[];
```

data classes used by group

#### classKey?

```ts
optional classKey: string;
```

Optional datasource class key used to source classIds

#### datasourceId?

```ts
optional datasourceId: string;
```

Datasource to generate metrics from

#### layerId?

```ts
optional layerId: string;
```

Optional ID of map layer associated with this metric

#### metricId

```ts
metricId: string;
```

Unique id of metric in project

#### objectiveId?

```ts
optional objectiveId: string;
```

group level objective, applies to all classes

#### type

```ts
type: string;
```

Metric type

---

### rows

```ts
rows: Record < string, string | (number > []);
```

Table rows, expected to have sketchName property and one property for each classId in classes

# ClassTableProps

## Properties

### columnConfig

```ts
columnConfig: ClassTableColumnConfig[];
```

configuration of one or more columns to display

***

### metricGroup

```ts
metricGroup: object;
```

Source for metric class definitions. if group has layerId at top-level, will display one toggle for whole group

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

#### type?

```ts
optional type: string;
```

unique identifier of what the metric represents, such as its type and method for calculation - e.g. areaOverlap, valueOverlap. To be defined by the user

***

### objective?

```ts
optional objective: object | object[];
```

Optional objective for metric

***

### rows

```ts
rows: object[];
```

Table row objects, each expected to have a classId and value.

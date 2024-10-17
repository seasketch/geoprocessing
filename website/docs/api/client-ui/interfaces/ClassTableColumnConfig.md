# ClassTableColumnConfig

## Properties

### chartOptions?

```ts
optional chartOptions: Partial<HorizontalStackedBarProps>;
```

override options for metricChart column type

***

### colStyle?

```ts
optional colStyle: CSSProperties;
```

additional style properties for column

***

### columnLabel?

```ts
optional columnLabel: string;
```

column header label

***

### metricId?

```ts
optional metricId: string;
```

metricId to use for column - metricGoal will access its values via the metricGroup

***

### percentFormatterOptions?

```ts
optional percentFormatterOptions: PercentEdgeOptions;
```

config options for percent value formatting.  see percentWithEdge function for more details

***

### targetValueFormatter?

```ts
optional targetValueFormatter: TargetFormatter;
```

formatting of target value based on the location of the row in the table

***

### type

```ts
type: 
  | "class"
  | "metricValue"
  | "metricChart"
  | "metricGoal"
  | "layerToggle";
```

column display type

***

### valueFormatter?

```ts
optional valueFormatter: ValueFormatter;
```

formatting to apply to values in column row, defaults to as-is 'value' formatting.

***

### valueLabel?

```ts
optional valueLabel: string | (value) => string;
```

unit string to display after value, or a format function that is passed the row value

***

### width?

```ts
optional width: number;
```

column percent width out of 100

# StatsObject

## Properties

### area?

```ts
optional area: number;
```

Area of valid cells in raster in square meters

***

### count?

```ts
optional count: number;
```

Total number of cells in raster, valid or invalid

***

### histogram?

```ts
optional histogram: Nullable<object>;
```

Histogram object, for categorical raster, mapping category IDs to cell count

***

### invalid?

```ts
optional invalid: number;
```

Number of nodata cells in raster

***

### max?

```ts
optional max: Nullable<number>;
```

Maximum value of any one valid cell in raster

***

### mean?

```ts
optional mean: Nullable<number>;
```

Mean average value of valid cells in raster

***

### median?

```ts
optional median: Nullable<number>;
```

Median average value of valid cells in raster

***

### min?

```ts
optional min: Nullable<number>;
```

Minimum value of valid cells in raster

***

### mode?

```ts
optional mode: Nullable<number>;
```

Mode of valid cells in raster

***

### range?

```ts
optional range: Nullable<number>;
```

Different between min and max value

***

### std?

```ts
optional std: Nullable<number>;
```

Standard deviation of valid cells in raster

***

### sum?

```ts
optional sum: number;
```

Sum of all valid cennls in raster

***

### valid?

```ts
optional valid: number;
```

Number of cells that are not nodata

***

### variance?

```ts
optional variance: Nullable<number>;
```

Statistical measurement of spread between values in raster

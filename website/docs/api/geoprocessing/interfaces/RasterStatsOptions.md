# RasterStatsOptions

options accepted by rasterStats

## Extends

- [`CalcStatsOptions`](CalcStatsOptions.md)

## Extended by

- [`OverlapRasterOptions`](OverlapRasterOptions.md)

## Properties

### categorical?

```ts
optional categorical: boolean;
```

If categorical raster, set to true

***

### categoryMetricProperty?

```ts
optional categoryMetricProperty: 
  | "classId"
  | "metricId"
  | "geographyId"
  | "sketchId"
  | "groupId";
```

If categorical raster, metric property name that categories are organized. Defaults to classId

***

### categoryMetricValues?

```ts
optional categoryMetricValues: string[];
```

If categorical raster, array of values to create metrics for.  Any values not provided won't be counted

***

### chunked?

```ts
optional chunked: boolean;
```

Whether or not to chunk calculations

#### Inherited from

[`CalcStatsOptions`](CalcStatsOptions.md).[`chunked`](CalcStatsOptions.md#chunked)

***

### feature?

```ts
optional feature: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | Feature<Polygon | MultiPolygon, GeoJsonProperties> | SketchCollection<Polygon | MultiPolygon> | Sketch<Polygon | MultiPolygon>;
```

single sketch or sketch collection filter to overlap with raster when calculating metrics.

***

### filter()?

```ts
optional filter: (index, value) => boolean;
```

Filter function to ignore raster values in stat calc

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `number` |
| `value` | `number` |

#### Returns

`boolean`

#### Inherited from

[`CalcStatsOptions`](CalcStatsOptions.md).[`filter`](CalcStatsOptions.md#filter)

***

### filterFn()?

```ts
optional filterFn: (cellValue) => boolean;
```

undocumented filter function (how different from filter option above?), for example a => a > 0 will filter out pixels greater than zero such that 'valid' is number of valid pixels greater than 0

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cellValue` | `number` |

#### Returns

`boolean`

***

### noData?

```ts
optional noData: number;
```

Override nodata value, which is ignored in calculations

#### Inherited from

[`CalcStatsOptions`](CalcStatsOptions.md).[`noData`](CalcStatsOptions.md#nodata)

***

### numBands?

```ts
optional numBands: number;
```

Optional number of bands in the raster, defaults to 1, used to initialize zero values

***

### stats?

```ts
optional stats: string[];
```

Stats to calculate

#### Inherited from

[`CalcStatsOptions`](CalcStatsOptions.md).[`stats`](CalcStatsOptions.md#stats)

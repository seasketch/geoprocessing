# OverlapRasterOptions

options accepted by rasterStats

## Extends

- [`RasterStatsOptions`](RasterStatsOptions.md)

## Properties

### bandMetricProperty?

```ts
optional bandMetricProperty: 
  | "classId"
  | "metricId"
  | "geographyId"
  | "sketchId"
  | "groupId";
```

If multi-band raster, metric property name that raster bands are organized by e.g. classID

***

### bandMetricValues?

```ts
optional bandMetricValues: string[];
```

If multi-band raster, object mapping band number (starting with 0 index) to unique ID value eg. ( 0: 'mangroves', 1: 'coral' ).  Defaults to 'band 1', 'band 2'

***

### categorical?

```ts
optional categorical: boolean;
```

If categorical raster, set to true

#### Overrides

[`RasterStatsOptions`](RasterStatsOptions.md).[`categorical`](RasterStatsOptions.md#categorical)

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

#### Overrides

[`RasterStatsOptions`](RasterStatsOptions.md).[`categoryMetricProperty`](RasterStatsOptions.md#categorymetricproperty)

***

### categoryMetricValues?

```ts
optional categoryMetricValues: string[];
```

If categorical raster, array of values to create metrics for

#### Overrides

[`RasterStatsOptions`](RasterStatsOptions.md).[`categoryMetricValues`](RasterStatsOptions.md#categorymetricvalues)

***

### chunked?

```ts
optional chunked: boolean;
```

Whether or not to chunk calculations

#### Inherited from

[`RasterStatsOptions`](RasterStatsOptions.md).[`chunked`](RasterStatsOptions.md#chunked)

***

### feature?

```ts
optional feature: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | Feature<Polygon | MultiPolygon, GeoJsonProperties> | SketchCollection<Polygon | MultiPolygon> | Sketch<Polygon | MultiPolygon>;
```

single sketch or sketch collection filter to overlap with raster when calculating metrics.

#### Inherited from

[`RasterStatsOptions`](RasterStatsOptions.md).[`feature`](RasterStatsOptions.md#feature)

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

[`RasterStatsOptions`](RasterStatsOptions.md).[`filter`](RasterStatsOptions.md#filter)

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

#### Inherited from

[`RasterStatsOptions`](RasterStatsOptions.md).[`filterFn`](RasterStatsOptions.md#filterfn)

***

### includeChildMetrics?

```ts
optional includeChildMetrics: boolean;
```

***

### metricId?

```ts
optional metricId: string;
```

Optional metricId to be assigned.  Don't use if you are calculating more than one stat because you won't be able to tell them apart

***

### metricIdPrefix?

```ts
optional metricIdPrefix: string;
```

Optional caller-provided prefix to add to metricId in addition to stat name e.g. 'coral' with metrics of 'sum', 'count', 'area' will generate metric IDs of 'coral-sum', 'coral-count', 'coral-area'

***

### noData?

```ts
optional noData: number;
```

Override nodata value, which is ignored in calculations

#### Inherited from

[`RasterStatsOptions`](RasterStatsOptions.md).[`noData`](RasterStatsOptions.md#nodata)

***

### numBands?

```ts
optional numBands: number;
```

Optional number of bands in the raster, defaults to 1, used to initialize zero values

#### Inherited from

[`RasterStatsOptions`](RasterStatsOptions.md).[`numBands`](RasterStatsOptions.md#numbands)

***

### stats?

```ts
optional stats: string[];
```

Stats to calculate

#### Inherited from

[`RasterStatsOptions`](RasterStatsOptions.md).[`stats`](RasterStatsOptions.md#stats)

***

### truncate?

```ts
optional truncate: boolean;
```

Truncates results to 6 digits, defaults to true

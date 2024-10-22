# ~~overlapRasterClass()~~

```ts
function overlapRasterClass(
   metricId, 
   raster, 
   sketch, 
   mapping, 
metricCategoryDimension): Promise<Metric[]>
```

Calculates sum of overlap between sketches and a categorical raster with numeric values representing feature classes
If sketch collection, then calculate overlap for all child sketches also

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `metricId` | `string` | `undefined` | metricId value to assign to each measurement |
| `raster` | [`Georaster`](../interfaces/Georaster.md) | `undefined` | Cloud-optimized geotiff, loaded via loadCog or geoblaze.parse(), representing categorical data (multiple classes) |
| `sketch` | `undefined` \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> | `undefined` | single sketch or collection. If undefined will return sum by feature class for the whole raster. Supports polygon or multipolygon. Will remove overlap between sketches, but will not remove overlap within Multipolygon sketch |
| `mapping` | `Record`\<`string`, `string`\> | `undefined` | Object mapping numeric category IDs (as strings e.g. "1") in the raster to their string names for display e.g. "Coral Reef" |
| `metricCategoryDimension` | \| `"classId"` \| `"metricId"` \| `"geographyId"` \| `"sketchId"` \| `"groupId"` | `"classId"` | Dimension to assign category name when creating metrics, defaults to classId |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

## Deprecated

use rasterMetrics instead

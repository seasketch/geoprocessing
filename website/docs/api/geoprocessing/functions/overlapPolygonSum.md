# overlapPolygonSum()

```ts
function overlapPolygonSum(
   metricId, 
   features, 
   sketch, 
options): Promise<Metric[]>
```

Calculates area overlap between sketch(es) and an array of polygon features.
Truncates input geometry coordinates down to 6 decimal places (~1m accuracy) before intersection to avoid floating point precision issues.
If sketch collection, then calculates area per sketch and for sketch collection, and does not overcount sketch overlap

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricId` | `string` | unique metric identifier to assign to each metric |
| `features` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] | to intersect and get overlap metrics |
| `sketch` | [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>[] | the sketches. If empty will return 0 result. |
| `options` | `object` | - |
| `options.includeChildMetrics`? | `boolean` | if false and sketch is collection, child sketch metrics will not be included in results, defaults to true |
| `options.sumProperty`? | `string` | Property in features with value to sum, if not defined each feature will count as 1 |
| `options.truncate`? | `boolean` | truncate results to 6 digits after decimal point, defaults to true |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

array of Metric objects

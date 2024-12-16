# overlapPolygonArea()

```ts
function overlapPolygonArea(
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
| `options.chunkSize`? | `number` | number of features to intersect at a time, to avoid infinite loop error, defaults to 5000 features |
| `options.includeChildMetrics`? | `boolean` | if false and sketch is collection, child sketch metrics will not be included in results, defaults to true |
| `options.solveOverlap`? | `boolean` | if true and sketch is collection, remove overlap between child sketches (using union) before calculating collection level metric, setting to false will be faster but will overcount any sketch overlap |
| `options.truncate`? | `boolean` | truncate results to 6 digits after decimal point, defaults to true |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

array of Metric objects

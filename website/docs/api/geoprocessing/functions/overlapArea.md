# overlapArea()

```ts
function overlapArea(
   metricId, 
   sketch, 
   outerArea, 
options): Promise<Metric[]>
```

Assuming sketches are within some outer boundary with size outerArea,
calculates the area of each sketch and the proportion of outerArea they take up.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricId` | `string` | Metric identifier |
| `sketch` | [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md)\> | single sketch or collection. |
| `outerArea` | `number` | area of outer boundary (typically EEZ or planning area) |
| `options` | `object` | - |
| `options.includeChildMetrics`? | `boolean` | If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true |
| `options.includePercMetric`? | `boolean` | Includes metrics with percent of total area, in addition to raw area value metrics, defaults to true |
| `options.simplifyTolerance`? | `number` | simplify sketches with tolerance in degrees. .000001 is a good first value to try. only used for calculating area of collection (avoiding clip union to remove overlap blowing up) |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

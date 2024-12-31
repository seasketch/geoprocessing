# ~~overlapArea()~~

```ts
function overlapArea(metricId, sketch, outerArea, options): Promise<Metric[]>;
```

Assuming sketches are within some outer boundary with size outerArea,
calculates metric for both the area of each sketch and the percentage of outerArea they take up.
If sketch is a collection, will return metrics for each child sketch as well as the collection
collection level metric will calculated by unioning child sketches to remove overlap.
If collection level calculation produces an "Unable to complete output ring" error, it
will fallback to simplify the sketch with simplifyTolerance (default to .0000001 if not passed) and try again.

## Parameters

| Parameter                      | Type                                                                                                                                                                             | Description                                                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metricId`                     | `string`                                                                                                                                                                         | Metric identifier                                                                                                                                 |
| `sketch`                       | [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md)\> | single sketch or collection.                                                                                                                      |
| `outerArea`                    | `number`                                                                                                                                                                         | area of outer boundary (e.g. planning area)                                                                                                       |
| `options`                      | `object`                                                                                                                                                                         | -                                                                                                                                                 |
| `options.includeChildMetrics`? | `boolean`                                                                                                                                                                        | If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true                                   |
| `options.includePercMetric`?   | `boolean`                                                                                                                                                                        | Includes metrics with percent of total area, in addition to raw area value metrics, defaults to true                                              |
| `options.simplifyTolerance`?   | `number`                                                                                                                                                                         | tolerance to simplify sketch coordinates in degrees. If provided, all sketches will be simplified with it, in order to avoid error when clipping. |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

## Deprecated

use overlapFeatures (numerators) + precalculated metrics (denominators) + toPercentMetric

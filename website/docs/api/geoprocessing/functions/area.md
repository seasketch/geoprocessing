# area()

```ts
function area(sketch, options): Promise<Metric[]>;
```

Calculates the area of each sketch and collection.

## Parameters

| Parameter                      | Type                                                                                                                                                                             | Description                                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `sketch`                       | [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md)\> | single sketch or collection.                                                                                                          |
| `options`                      | `object`                                                                                                                                                                         | -                                                                                                                                     |
| `options.includeChildMetrics`? | `boolean`                                                                                                                                                                        | If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true                       |
| `options.includePercMetric`?   | `boolean`                                                                                                                                                                        | If collection, includes metrics with percent of total area for each sketch , in addition to raw area value metrics, defaults to false |
| `options.metricId`?            | `string`                                                                                                                                                                         | Optional metric identifier, defaults to 'area'                                                                                        |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

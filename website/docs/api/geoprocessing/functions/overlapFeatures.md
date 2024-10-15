# overlapFeatures()

```ts
function overlapFeatures(
  metricId,
  features,
  sketch,
  options?,
): Promise<Metric[]>;
```

Calculates overlap between sketch(es) and an array of polygon features.
Supports area or sum operation (given sumProperty), defaults to area
If sketch collection includes overall and per sketch

## Parameters

| Parameter  | Type                                                                                                                                                                                                                                                                                                                                                                                                                        | Description                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `metricId` | `string`                                                                                                                                                                                                                                                                                                                                                                                                                    | -                                            |
| `features` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[]                                                                                                                                                                                                                            | features to intersect and get overlap stats  |
| `sketch`   | [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>[] | the sketches. If empty will return 0 result. |
| `options`? | `Partial`\<`OverlapFeatureOptions`\>                                                                                                                                                                                                                                                                                                                                                                                        | -                                            |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

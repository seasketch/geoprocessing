# ~~overlapSubarea()~~

```ts
function overlapSubarea(
   metricId, 
   sketch, 
   subareaFeature, 
options?): Promise<Metric[]>
```

Returns area stats for sketch input after performing overlay operation against a subarea feature.
Includes both area overlap and percent area overlap metrics, because calculating percent later would be too complicated
For sketch collections, dissolve is used when calculating total sketch area to prevent double counting

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metricId` | `string` | Metric identifier |
| `sketch` | [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md)\> | Single sketch or collection |
| `subareaFeature` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> | subarea feature |
| `options`? | `object` | - |
| `options.operation`? | `"intersection"` \| `"difference"` | operation to perform on sketch in relation to sub area features, defaults to 'intersection' |
| `options.outerArea`? | `number` | area of outer boundary. Use for total area of the subarea for intersection when you don't have the whole feature, or use for the total area of the boundar outside of the subarea for difference (typically EEZ or planning area) |
| `options.simplifyTolerance`? | `number` | simplify sketches with tolerance in degrees. .000001 is a good first value to try. only used for calculating area of collection (avoiding clip union to remove overlap blowing up) |

## Returns

`Promise`\<[`Metric`](../type-aliases/Metric.md)[]\>

## Deprecated

- using geographies will clip your datasources and you can just use overlapFeatures.  This will be removed in a future version

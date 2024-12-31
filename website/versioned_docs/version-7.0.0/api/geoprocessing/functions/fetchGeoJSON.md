# fetchGeoJSON()

```ts
function fetchGeoJSON<G>(
  request,
): Promise<
  | Feature<G, GeoJsonProperties>
  | FeatureCollection<G, GeoJsonProperties>
  | Sketch<G>
  | SketchCollection<G>
>;
```

Given geoprocessing function request, fetches the GeoJSON, which can also be sketch JSON

## Type Parameters

| Type Parameter                                          |
| ------------------------------------------------------- |
| `G` _extends_ [`Geometry`](../type-aliases/Geometry.md) |

## Parameters

| Parameter | Type                                                                                                                                                         | Description |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `request` | [`GeoprocessingRequestModel`](../interfaces/GeoprocessingRequestModel.md)\<`G`\> \| [`GeoprocessingRequest`](../type-aliases/GeoprocessingRequest.md)\<`G`\> |             |

## Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`FeatureCollection`](../interfaces/FeatureCollection.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<`G`\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\>\>

the JSON with geometry type optionally specified by request

# loadFgbFromDisk()

```ts
function loadFgbFromDisk<G>(path): FeatureCollection<G, GeoJsonProperties>
```

Synchronously load a flatgeobuf file from disk.  Assumed to be in WGS84 EPSG:4326 projection

## Type Parameters

| Type Parameter |
| ------ |
| `G` *extends* [`Geometry`](../type-aliases/Geometry.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | path to flatgeobuf file |

## Returns

[`FeatureCollection`](../interfaces/FeatureCollection.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>

feature collection of features from disk

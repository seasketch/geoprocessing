# isPolygonFeature()

```ts
function isPolygonFeature(feature): feature is Feature<Polygon, GeoJsonProperties>
```

Check if object is a Polygon feature.  Any code inside a block guarded by a conditional call to this function will have type narrowed

## Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | `any` |

## Returns

`feature is Feature<Polygon, GeoJsonProperties>`

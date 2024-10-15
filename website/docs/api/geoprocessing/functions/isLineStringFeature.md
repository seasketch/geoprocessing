# isLineStringFeature()

```ts
function isLineStringFeature(feature): feature is Feature<LineString, GeoJsonProperties>
```

Check if object is a Linestring.  Any code inside a block guarded by a conditional call to this function will have type narrowed

## Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | `any` |

## Returns

`feature is Feature<LineString, GeoJsonProperties>`

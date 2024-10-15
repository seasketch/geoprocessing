# isPolygonAnyFeature()

```ts
function isPolygonAnyFeature(
  feature,
): feature is Feature<MultiPolygon, GeoJsonProperties>;
```

Check if object is a Polygon or MultiPolygon. Any code inside a block guarded by a conditional call to this function will have type narrowed

## Parameters

| Parameter | Type  |
| --------- | ----- |
| `feature` | `any` |

## Returns

`feature is Feature<MultiPolygon, GeoJsonProperties>`

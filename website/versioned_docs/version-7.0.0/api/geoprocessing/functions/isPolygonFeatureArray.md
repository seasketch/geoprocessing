# isPolygonFeatureArray()

```ts
function isPolygonFeatureArray(
  featureArray,
): featureArray is Feature<Polygon, GeoJsonProperties>[];
```

Check if object is an array of Polygon features. Any code inside a block guarded by a conditional call to this function will have type narrowed

## Parameters

| Parameter      | Type  |
| -------------- | ----- |
| `featureArray` | `any` |

## Returns

`featureArray is Feature<Polygon, GeoJsonProperties>[]`

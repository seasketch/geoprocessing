# isPointFeature()

```ts
function isPointFeature(feature): feature is Feature<Point, GeoJsonProperties>;
```

Check if object is a Point. Any code inside a block guarded by a conditional call to this function will have type narrowed

## Parameters

| Parameter | Type  |
| --------- | ----- |
| `feature` | `any` |

## Returns

`feature is Feature<Point, GeoJsonProperties>`

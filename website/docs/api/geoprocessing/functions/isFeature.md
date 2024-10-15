# isFeature()

```ts
function isFeature(feature): feature is Feature<Geometry, GeoJsonProperties>;
```

Check if object is a Feature. Any code inside a block guarded by a conditional call to this function will have type narrowed

## Parameters

| Parameter | Type  |
| --------- | ----- |
| `feature` | `any` |

## Returns

`feature is Feature<Geometry, GeoJsonProperties>`

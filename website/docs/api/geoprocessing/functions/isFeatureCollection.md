# isFeatureCollection()

```ts
function isFeatureCollection(feature): feature is FeatureCollection<Geometry, GeoJsonProperties>
```

Check if object is a Feature Collection.  Any code inside a block guarded by a conditional call to this function will have type narrowed

## Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | `any` |

## Returns

`feature is FeatureCollection<Geometry, GeoJsonProperties>`

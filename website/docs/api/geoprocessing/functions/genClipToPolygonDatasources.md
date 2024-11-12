# genClipToPolygonDatasources()

```ts
function genClipToPolygonDatasources<P>(
   project, 
   operations, 
options): (feature) => Promise<Feature<Geometry, GeoJsonProperties>>
```

Returns a function that applies clip operations to a feature using polygon datasource features

## Type Parameters

| Type Parameter |
| ------ |
| `P` *extends* [`ProjectClientInterface`](../interfaces/ProjectClientInterface.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `project` | `P` | - |
| `operations` | [`DatasourceClipOperation`](../interfaces/DatasourceClipOperation.md)[] | Load clip features from datasources for clip operations |
| `options` | [`ClipOptions`](../interfaces/ClipOptions.md) | - |

## Returns

`Function`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

### Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>\>

## Throws

if clipped feature is larger than maxSize, defaults to 500K km

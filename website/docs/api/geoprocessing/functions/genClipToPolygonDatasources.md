# genClipToPolygonDatasources()

```ts
function genClipToPolygonDatasources<P>(
   project, 
   clipOperations, 
options): (feature) => Promise<Feature<Geometry, GeoJsonProperties>>
```

Returns a function that Takes a Polygon feature and returns the portion remaining after performing clipOperations against one or more datasources

## Type Parameters

| Type Parameter |
| ------ |
| `P` *extends* [`ProjectClientInterface`](../interfaces/ProjectClientInterface.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `project` | `P` | project client to use for accessing datasources |
| `clipOperations` | [`DatasourceClipOperation`](../interfaces/DatasourceClipOperation.md)[] | array of DatasourceClipOperations |
| `options` | [`ClipOptions`](../interfaces/ClipOptions.md) | clip options |

## Returns

`Function`

clipped polygon

### Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

### Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>\>

## Throws

if a datasource fetch returns no features or if nothing remains of feature after clip operations

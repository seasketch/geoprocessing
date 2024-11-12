# ~~genClipLoader()~~

```ts
function genClipLoader<P>(project, operations): (feature) => Promise<object[]>
```

Given a project client and 1 or more clip operations, returns a function that when called
loads clip features from their datasources that overlap with the feature polygon to clip.
Pass this function to genPreprocessor() and it will take care of the rest.

## Type Parameters

| Type Parameter |
| ------ |
| `P` *extends* [`ProjectClientInterface`](../interfaces/ProjectClientInterface.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `project` | `P` |
| `operations` | [`DatasourceClipOperation`](../interfaces/DatasourceClipOperation.md)[] |

## Returns

`Function`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

### Returns

`Promise`\<`object`[]\>

## Deprecated

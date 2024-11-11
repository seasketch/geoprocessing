# getFeatures()

```ts
function getFeatures<F>(
   datasource, 
   url, 
options): Promise<F[]>
```

Returns features for a variety of vector datasources and formats, with additional filter options

## Type Parameters

| Type Parameter |
| ------ |
| `F` *extends* [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `datasource` | `object` \| `object` \| `object` & `object` | - |
| `url` | `string` | url of datasource |
| `options` | [`DatasourceOptions`](../interfaces/DatasourceOptions.md) | - |

## Returns

`Promise`\<`F`[]\>

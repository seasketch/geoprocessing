# getDatasourceFeatures()

```ts
function getDatasourceFeatures<G>(
   datasource, 
   url, 
options): Promise<Feature<G>[]>
```

Fetches and returns features for a given datasource supporting a variety of formats/clients

## Type Parameters

| Type Parameter |
| ------ |
| `G` *extends* \| [`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md) \| [`Point`](../interfaces/Point.md) \| `MultiPoint` \| [`LineString`](../interfaces/LineString.md) \| [`MultiLineString`](../interfaces/MultiLineString.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `datasource` | `object` \| `object` \| `object` & `object` | the datasource to fetch features from |
| `url` | `string` | the url of the datasource |
| `options` | [`GetDatasourceFeaturesOptions`](../interfaces/GetDatasourceFeaturesOptions.md) | - |

## Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<`G`\>[]\>

feature array

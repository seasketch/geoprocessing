# PreprocessingHandler\<G, P\>

Lambda handler for a preprocessing function

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `G` *extends* [`Geometry`](../type-aliases/Geometry.md) | [`Polygon`](../interfaces/Polygon.md) \| [`LineString`](../interfaces/LineString.md) \| [`Point`](../interfaces/Point.md) | the geometry type of the feature for the geoprocessing function, automatically set from func feature type |
| `P` | `Record`\<`string`, [`JSONValue`](../type-aliases/JSONValue.md)\> | - |

## Constructors

### new PreprocessingHandler()

```ts
new PreprocessingHandler<G, P>(func, options): PreprocessingHandler<G, P>
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `func` | (`feature`, `extraParams`) => `Promise`\<[`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>\> | the preprocessing function, overloaded to allow caller to pass Feature *or* Sketch |
| `options` | [`PreprocessingHandlerOptions`](../interfaces/PreprocessingHandlerOptions.md) | prerocessing function deployment options |

#### Returns

[`PreprocessingHandler`](PreprocessingHandler.md)\<`G`, `P`\>

### new PreprocessingHandler()

```ts
new PreprocessingHandler<G, P>(func, options): PreprocessingHandler<G, P>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `func` | (`feature`, `extraParams`) => `Promise`\<[`Sketch`](../interfaces/Sketch.md)\<`G`\>\> |
| `options` | [`PreprocessingHandlerOptions`](../interfaces/PreprocessingHandlerOptions.md) |

#### Returns

[`PreprocessingHandler`](PreprocessingHandler.md)\<`G`, `P`\>

## Methods

### lambdaHandler()

```ts
lambdaHandler(event, context): Promise<APIGatewayProxyResult>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `APIGatewayProxyEvent` |
| `context` | `Context` |

#### Returns

`Promise`\<`APIGatewayProxyResult`\>

***

### parseRequest()

```ts
parseRequest(event): PreprocessingRequest
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `APIGatewayProxyEvent` |

#### Returns

[`PreprocessingRequest`](../interfaces/PreprocessingRequest.md)

## Properties

### func()

```ts
func: (feature, extraParams) => Promise<Feature<G, GeoJsonProperties> | Sketch<G>>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `feature` | [`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<`G`\> |
| `extraParams` | `P` |

#### Returns

`Promise`\<[`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<`G`\>\>

***

### lastRequestId?

```ts
optional lastRequestId: string;
```

***

### options

```ts
options: PreprocessingHandlerOptions;
```

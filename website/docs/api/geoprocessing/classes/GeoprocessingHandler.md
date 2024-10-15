# GeoprocessingHandler\<T, G, P\>

Manages the task of executing a geoprocessing function within an AWS Lambda function.
This includes sending estimate of completion, caching the results, and getting them back to the client.
Supports 2 different execution modes for running a geoprocessing function - sync and async
These modes create 3 different request scenarios. A lambda is created for each scenario, and they all run
this one handler.
1 - sync executionMode - immediately run gp function and return result in resolved promise to client
2 - async executionMode, ASYNC_REQUEST_TYPE=start - invoke a second lambda to run gp function and return incomplete task to client with socket for notification of result
3 - async executionMode, ASYNC_REQUEST_TYPE=run - run gp function started by scenario 2 and send completed task info on socket for client to pick up result

## Type Parameters

| Type Parameter                                                                  | Default type                                                                                                              | Description                                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `T`                                                                             | [`JSONValue`](../type-aliases/JSONValue.md)                                                                               | the return type of the geoprocessing function, automatically set from func return type                 |
| `G` _extends_ [`Geometry`](../type-aliases/Geometry.md)                         | [`Polygon`](../interfaces/Polygon.md) \| [`LineString`](../interfaces/LineString.md) \| [`Point`](../interfaces/Point.md) | the geometry type of features for the geoprocessing function, automatically set from func feature type |
| `P` _extends_ `Record`\<`string`, [`JSONValue`](../type-aliases/JSONValue.md)\> | `Record`\<`string`, [`JSONValue`](../type-aliases/JSONValue.md)\>                                                         | extra parameters to pass to geoprocessing function, automatically set from func parameter type         |

## Constructors

### new GeoprocessingHandler()

```ts
new GeoprocessingHandler<T, G, P>(func, options): GeoprocessingHandler<T, G, P>
```

#### Parameters

| Parameter | Type                                                                          | Description                               |
| --------- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| `func`    | (`feature`, `extraParams`, `request`?) => `Promise`\<`T`\>                    | the geoprocessing function to run         |
| `options` | [`GeoprocessingHandlerOptions`](../interfaces/GeoprocessingHandlerOptions.md) | geoprocessing function deployment options |

#### Returns

[`GeoprocessingHandler`](GeoprocessingHandler.md)\<`T`, `G`, `P`\>

### new GeoprocessingHandler()

```ts
new GeoprocessingHandler<T, G, P>(func, options): GeoprocessingHandler<T, G, P>
```

#### Parameters

| Parameter | Type                                                                          |
| --------- | ----------------------------------------------------------------------------- |
| `func`    | (`feature`, `extraParams`, `request`?) => `Promise`\<`T`\>                    |
| `options` | [`GeoprocessingHandlerOptions`](../interfaces/GeoprocessingHandlerOptions.md) |

#### Returns

[`GeoprocessingHandler`](GeoprocessingHandler.md)\<`T`, `G`, `P`\>

## Methods

### getSocket()

```ts
getSocket(wss): Promise<WebSocket>
```

Returns a new socket connection to send a message

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `wss`     | `string` |

#### Returns

`Promise`\<`WebSocket`\>

---

### lambdaHandler()

```ts
lambdaHandler(event, context): Promise<APIGatewayProxyResult>
```

Given request event, runs geoprocessing function and returns APIGatewayProxyResult with task status in the body
If sync executionMode, then result is returned with task, if async executionMode, then returns socket for client to listen for task update
If event.geometry present, assumes request is already a GeoprocessingRequest (from AWS console).
If event.queryStringParameters present, request must be from API Gateway and need to coerce into GeoprocessingRequest
If event.body present with JSON string, then parse as a GeoprocessingRequest

#### Parameters

| Parameter | Type                   |
| --------- | ---------------------- |
| `event`   | `APIGatewayProxyEvent` |
| `context` | `Context`              |

#### Returns

`Promise`\<`APIGatewayProxyResult`\>

---

### parseRequest()

```ts
parseRequest<G>(event): GeoprocessingRequestModel<G>
```

Parses event and returns GeoprocessingRequestModel object.

#### Type Parameters

| Type Parameter |
| -------------- |
| `G`            |

#### Parameters

| Parameter | Type                   |
| --------- | ---------------------- |
| `event`   | `APIGatewayProxyEvent` |

#### Returns

[`GeoprocessingRequestModel`](../interfaces/GeoprocessingRequestModel.md)\<`G`\>

---

### sendSocketErrorMessage()

```ts
sendSocketErrorMessage(
   wss,
   cacheKey,
   serviceName,
failureMessage): Promise<void>
```

Send task error message

#### Parameters

| Parameter        | Type                    |
| ---------------- | ----------------------- |
| `wss`            | `string`                |
| `cacheKey`       | `undefined` \| `string` |
| `serviceName`    | `string`                |
| `failureMessage` | `string`                |

#### Returns

`Promise`\<`void`\>

---

### sendSocketMessage()

```ts
sendSocketMessage(
   wss,
   cacheKey,
serviceName): Promise<void>
```

Send completed task message

#### Parameters

| Parameter     | Type                    |
| ------------- | ----------------------- |
| `wss`         | `string`                |
| `cacheKey`    | `undefined` \| `string` |
| `serviceName` | `string`                |

#### Returns

`Promise`\<`void`\>

## Properties

### func()

```ts
func: (feature, extraParams?, request?) => Promise<T>;
```

#### Parameters

| Parameter      | Type                                                                                                                                                                                                                                                                                                                                                       | Description                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `feature`      | [`Feature`](../interfaces/Feature.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`FeatureCollection`](../interfaces/FeatureCollection.md)\<`G`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<`G`\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\> | -                                                                                                                              |
| `extraParams`? | `P`                                                                                                                                                                                                                                                                                                                                                        | Optional additional runtime parameters from report client for geoprocessing function. Validation left to implementing function |
| `request`?     | [`GeoprocessingRequestModel`](../interfaces/GeoprocessingRequestModel.md)\<`G`\>                                                                                                                                                                                                                                                                           | Original event params used to invoke geoprocessing function made accessible to func                                            |

#### Returns

`Promise`\<`T`\>

---

### lastRequestId?

```ts
optional lastRequestId: string;
```

---

### options

```ts
options: GeoprocessingHandlerOptions;
```

---

### Tasks

```ts
Tasks: TasksModel;
```

# runLambdaWorker()

```ts
function runLambdaWorker(
  sketch,
  projectName,
  functionName,
  region,
  functionParameters,
  request,
  options,
): Promise<InvocationResponse>;
```

Runs a function on a specified lambda worker

## Parameters

| Parameter              | Type                                                                                                                                                                                                                                                                                   | Description                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `sketch`               | [`SketchCollection`](../interfaces/SketchCollection.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> \| [`Sketch`](../interfaces/Sketch.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\> |                                                                   |
| `projectName`          | `string`                                                                                                                                                                                                                                                                               | name of project in package.json                                   |
| `functionName`         | `string`                                                                                                                                                                                                                                                                               | name of sync geoprocessing function to run as worker              |
| `region`               | `string`                                                                                                                                                                                                                                                                               | AWS region specified in geoprocessing.json                        |
| `functionParameters`   | `object`                                                                                                                                                                                                                                                                               | parameters required by lambda worker function                     |
| `request`              | [`GeoprocessingRequestModel`](../interfaces/GeoprocessingRequestModel.md)\<[`Polygon`](../interfaces/Polygon.md) \| [`MultiPolygon`](../interfaces/MultiPolygon.md)\>                                                                                                                  |                                                                   |
| `options`              | `object`                                                                                                                                                                                                                                                                               | -                                                                 |
| `options.enableCache`? | `boolean`                                                                                                                                                                                                                                                                              | Whether cache of worker task should be enabled, defaults to false |

## Returns

`Promise`\<`InvocationResponse`\>

Lambda invocation response

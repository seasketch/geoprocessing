# runTask()

```ts
function runTask(
  url,
  payload,
  signal,
  checkCacheOnly,
  onConnect,
): Promise<GeoprocessingTask<any>>;
```

Runs task by sending GET request to url with payload and optional flags
Task can be aborted using caller-provided AbortSignal

## Parameters

| Parameter        | Type                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| `url`            | `string`                                                                           |
| `payload`        | [`GeoprocessingRequest`](../../geoprocessing/type-aliases/GeoprocessingRequest.md) |
| `signal`         | `AbortSignal`                                                                      |
| `checkCacheOnly` | `boolean`                                                                          |
| `onConnect`      | `boolean`                                                                          |

## Returns

`Promise`\<[`GeoprocessingTask`](../../geoprocessing/interfaces/GeoprocessingTask.md)\<`any`\>\>

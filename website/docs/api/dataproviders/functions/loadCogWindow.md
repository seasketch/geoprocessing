# ~~loadCogWindow()~~

```ts
function loadCogWindow(url, options): Promise<any>;
```

Returns georaster window (image subset) defined by options.windowBox, otherwise loads the whole raster
windowBox is extended out to the nearest pixel edge to (in theory) avoid resampling. Assumes raster is in WGS84 degrees
This function front loads the raster values, so subsequent geoblaze calls (e.g. sum) can be called sync

## Parameters

| Parameter | Type         |
| --------- | ------------ |
| `url`     | `string`     |
| `options` | `CogOptions` |

## Returns

`Promise`\<`any`\>

## Deprecated

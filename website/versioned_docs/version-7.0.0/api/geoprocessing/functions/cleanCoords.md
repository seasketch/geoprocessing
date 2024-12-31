# cleanCoords()

```ts
function cleanCoords(geojson, options): any;
```

Cleans geojson coordinates to be within the bounds of the world [-90, -180, 90, 180], so that they don't wrap off the end, and can be split

## Parameters

| Parameter         | Type      | Description                                                          |
| ----------------- | --------- | -------------------------------------------------------------------- |
| `geojson`         | `any`     |                                                                      |
| `options`         | `object`  |                                                                      |
| `options.mutate`? | `boolean` | whether or not to mutate the coordinates in place, defaults to false |

## Returns

`any`

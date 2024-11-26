# cleanBBox()

```ts
function cleanBBox(bbox): number[]
```

Normalizes bounding box longitude values to the [-180, 180] range if they cross the antimeridian

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bbox` | [`BBox`](../type-aliases/BBox.md) | the bounding box to clean |

## Returns

`number`[]

the cleaned bounding box

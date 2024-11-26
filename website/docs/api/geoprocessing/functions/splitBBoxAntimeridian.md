# splitBBoxAntimeridian()

```ts
function splitBBoxAntimeridian(bbox): number[][]
```

If bounding box crosses antimeridian (and extends outside the range of -180 to 180),
split it into two bounding boxes at the antimeridian.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bbox` | [`BBox`](../type-aliases/BBox.md) | the bounding box to split |

## Returns

`number`[][]

array of one or two bounding boxes

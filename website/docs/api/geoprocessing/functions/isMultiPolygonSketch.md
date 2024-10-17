# isMultiPolygonSketch()

```ts
function isMultiPolygonSketch(sketch): sketch is Sketch<MultiPolygon>
```

Checks if sketch is a MultiPolygon. Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch

## Parameters

| Parameter | Type |
| ------ | ------ |
| `sketch` | `any` |

## Returns

`sketch is Sketch<MultiPolygon>`

# isSketch()

```ts
function isSketch(feature): feature is Sketch<SketchGeometryTypes>;
```

Checks if object is a Sketch. Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch

## Parameters

| Parameter | Type  |
| --------- | ----- |
| `feature` | `any` |

## Returns

`feature is Sketch<SketchGeometryTypes>`

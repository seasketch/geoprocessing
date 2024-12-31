# isSketchCollection()

```ts
function isSketchCollection(
  collection,
): collection is SketchCollection<SketchGeometryTypes>;
```

Check if object is a SketchCollection. Any code inside a block guarded by a conditional call to this function will have type narrowed to SketchCollection

## Parameters

| Parameter    | Type  |
| ------------ | ----- |
| `collection` | `any` |

## Returns

`collection is SketchCollection<SketchGeometryTypes>`

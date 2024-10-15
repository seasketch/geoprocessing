# genSampleNullSketchCollection()

```ts
function genSampleNullSketchCollection(sketches, name?): NullSketchCollection;
```

Given feature collection, return a sketch collection with reasonable random props.
The geometry type of the returned collection will match the one passed in

## Parameters

| Parameter  | Type                                          |
| ---------- | --------------------------------------------- |
| `sketches` | [`NullSketch`](../interfaces/NullSketch.md)[] |
| `name`?    | `string`                                      |

## Returns

[`NullSketchCollection`](../interfaces/NullSketchCollection.md)

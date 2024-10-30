# flattenBySketchAllClass()

```ts
function flattenBySketchAllClass(
   metrics, 
   classes, 
   sketchProperties, 
   sortFn?): Record<string, string | number>[]
```

Flattens class sketch metrics into array of objects, one for each sketch,
where each object contains sketch id, sketch name, and all metric values for each class

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metrics` | `object`[] | List of metrics, expects one metric per sketch and class combination |
| `classes` | `object`[] | Data classes represented in metrics |
| `sketchProperties` | [`SketchProperties`](../type-aliases/SketchProperties.md)[] | SketchProperties of sketches represented in metrics |
| `sortFn`? | (`a`, `b`) => `number` | Function to sort class configs using Array.sort (defaults to alphabetical by display name) |

## Returns

`Record`\<`string`, `string` \| `number`\>[]

An array of objects with flattened sketch metrics

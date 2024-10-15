# getSketchToMpaProtectionLevel()

```ts
function getSketchToMpaProtectionLevel(
  sketch,
  metrics,
): Record<string, RbcsMpaProtectionLevel>;
```

Returns object mapping sketch id to MPA classification
given sketch for rbcsMpa or collection of sketches for rbcsMpas with rbcs activity userAttributes,
and area metrics for each sketch, assumes each mpa is a single zone mpa

## Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                                                                   | Description                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `sketch`  | [`NullSketch`](../interfaces/NullSketch.md) \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`NullSketchCollection`](../interfaces/NullSketchCollection.md) \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> | sketch or sketch collection with GEAR_TYPES (multi), BOATING (single), and AQUACULTURE (single) user attributes |
| `metrics` | `object`[]                                                                                                                                                                                                                                                                                                                                             | -                                                                                                               |

## Returns

`Record`\<`string`, [`RbcsMpaProtectionLevel`](../type-aliases/RbcsMpaProtectionLevel.md)\>

# includeVirtualSketch()

```ts
function includeVirtualSketch<G>(
  sketchColl,
  mergeSketchColl,
  sketchTest,
): SketchCollection<G>;
```

If sketch collection passes sketchTest, then returns new collection
with mergeSketchColl sketches appended and updated bbox

## Type Parameters

| Type Parameter                                                                |
| ----------------------------------------------------------------------------- |
| `G` _extends_ [`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md) |

## Parameters

| Parameter         | Type                                                           |
| ----------------- | -------------------------------------------------------------- |
| `sketchColl`      | [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\> |
| `mergeSketchColl` | [`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\> |
| `sketchTest`      | (`collection`) => `boolean`                                    |

## Returns

[`SketchCollection`](../interfaces/SketchCollection.md)\<`G`\>

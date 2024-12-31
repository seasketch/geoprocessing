# getUserAttribute()

## getUserAttribute(sketchOrProps, exportid)

```ts
function getUserAttribute<T>(sketchOrProps, exportid): T | undefined;
```

UserAttributes are those filled in via the attributes form specified as
part of a SketchClass. This getter function is easier to use than searching
the Sketch.properties.userAttributes array, supports default values, and is
easier to use with typescript.

### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

### Parameters

| Parameter       | Type                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sketchOrProps` | [`SketchProperties`](../type-aliases/SketchProperties.md) \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> |
| `exportid`      | `string`                                                                                                                                                                                                                                                                                          |

### Returns

`T` \| `undefined`

## getUserAttribute(sketchOrProps, exportid, defaultValue)

```ts
function getUserAttribute<T>(sketchOrProps, exportid, defaultValue): T;
```

### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

### Parameters

| Parameter       | Type                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sketchOrProps` | [`SketchProperties`](../type-aliases/SketchProperties.md) \| [`Sketch`](../interfaces/Sketch.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> \| [`SketchCollection`](../interfaces/SketchCollection.md)\<[`SketchGeometryTypes`](../type-aliases/SketchGeometryTypes.md)\> |
| `exportid`      | `string`                                                                                                                                                                                                                                                                                          |
| `defaultValue`  | `T`                                                                                                                                                                                                                                                                                               |

### Returns

`T`

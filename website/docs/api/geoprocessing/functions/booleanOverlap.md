# booleanOverlap()

## booleanOverlap(featureAInput, featureBInput, idProperty)

```ts
function booleanOverlap<B>(
   featureAInput, 
   featureBInput, 
idProperty?): Promise<B[]>
```

Returns all B items that overlap with a A items
Not all Feature types are supported, see typedoc
A and B must have the same geometry dimension (single or multi). Builds on @turf/boolean-overlap.

### Type Parameters

| Type Parameter |
| ------ |
| `B` *extends* [`Feature`](../interfaces/Feature.md)\<`any`, [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `featureAInput` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] | - |
| `featureBInput` | `B` \| `B`[] | - |
| `idProperty`? | `string` | property in Feature B to track if overlap already found. Useful if multiple features have same property value and you only want the first match. |

### Returns

`Promise`\<`B`[]\>

## booleanOverlap(featureAInput, featureBInput, idProperty)

```ts
function booleanOverlap<B>(
   featureAInput, 
   featureBInput, 
idProperty?): Promise<B[]>
```

### Type Parameters

| Type Parameter |
| ------ |
| `B` *extends* [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `featureAInput` | [`Geometry`](../type-aliases/Geometry.md)[] |
| `featureBInput` | `B` \| `B`[] |
| `idProperty`? | `string` |

### Returns

`Promise`\<`B`[]\>

## booleanOverlap(featureAInput, featureBInput, idProperty)

```ts
function booleanOverlap<B>(
   featureAInput, 
   featureBInput, 
idProperty?): Promise<B[]>
```

### Type Parameters

| Type Parameter |
| ------ |
| `B` *extends* [`Geometry`](../type-aliases/Geometry.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `featureAInput` | [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\> \| [`Feature`](../interfaces/Feature.md)\<[`Geometry`](../type-aliases/Geometry.md), [`GeoJsonProperties`](../type-aliases/GeoJsonProperties.md)\>[] |
| `featureBInput` | `B` \| `B`[] |
| `idProperty`? | `string` |

### Returns

`Promise`\<`B`[]\>

## booleanOverlap(featureAInput, featureBInput, idProperty)

```ts
function booleanOverlap<B>(
   featureAInput, 
   featureBInput, 
idProperty?): Promise<B[]>
```

### Type Parameters

| Type Parameter |
| ------ |
| `B` *extends* [`Geometry`](../type-aliases/Geometry.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `featureAInput` | [`Geometry`](../type-aliases/Geometry.md) \| [`Geometry`](../type-aliases/Geometry.md)[] |
| `featureBInput` | `B` \| `B`[] |
| `idProperty`? | `string` |

### Returns

`Promise`\<`B`[]\>

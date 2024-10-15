# rasterCalculator()

```ts
type rasterCalculator: (raster, operation) => Promise<Georaster>;
```

## Parameters

| Parameter   | Type                                             |
| ----------- | ------------------------------------------------ |
| `raster`    | [`Georaster`](../interfaces/Georaster.md)        |
| `operation` | (...`cellValuesPerBand`) => `number` \| `string` |

## Returns

`Promise`\<[`Georaster`](../interfaces/Georaster.md)\>

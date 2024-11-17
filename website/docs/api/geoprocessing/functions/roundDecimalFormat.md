# roundDecimalFormat()

```ts
function roundDecimalFormat(
   value, 
   decimals, 
   options): string
```

Rounds number to a fixed number of decimals, then formats as a human readable string

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Value to round |
| `decimals` | `number` | `1` | Number of digits after the decimal point to keep |
| `options` | [`RoundDecimalOptions`](../interfaces/RoundDecimalOptions.md) | `{}` | - |

## Returns

`string`

rounded number as a human readable string

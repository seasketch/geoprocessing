# roundDecimal()

```ts
function roundDecimal(
   value, 
   decimals, 
   options): number
```

Rounds number to a fixed number of decimals

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Value to round |
| `decimals` | `number` | `1` | Number of digits after the decimal point to keep |
| `options` | `object` | `{}` | - |
| `options.keepSmallValues`? | `boolean` | `undefined` | If true, will keep any small value as-is which would be rounded to 0, defaults to false |

## Returns

`number`

rounded number

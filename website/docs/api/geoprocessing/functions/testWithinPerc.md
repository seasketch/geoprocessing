# testWithinPerc()

```ts
function testWithinPerc(
   testValue, 
   expectedValue, 
   options?): void
```

Expects that testValue is equal to expectedValue or optionally within percentage (defaults to .01 or 1%)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `testValue` | `number` |
| `expectedValue` | `number` |
| `options`? | `object` |
| `options.debug`? | `boolean` |
| `options.withinPerc`? | `number` |

## Returns

`void`

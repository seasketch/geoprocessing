# TargetFormatter()

```ts
type TargetFormatter: (value, row, numRows) => (value) => string | JSX.Element;
```

Function that given target value for current table row, the table row index, and total number of
table rows, returns a function that given target value returns a
formatted string or Element. In other words a function that handles the formatting based on where
the row is in the table and returns a function handling the remaining formatting.

## Parameters

| Parameter | Type     |
| --------- | -------- |
| `value`   | `number` |
| `row`     | `number` |
| `numRows` | `number` |

## Returns

`Function`

### Parameters

| Parameter | Type     |
| --------- | -------- |
| `value`   | `number` |

### Returns

`string` \| `JSX.Element`

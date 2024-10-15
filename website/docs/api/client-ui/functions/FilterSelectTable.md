# FilterSelectTable()

```ts
function FilterSelectTable<D>(props): ReactElement;
```

Table with customizable filter functions as CheckboxGroup that when selected
filter the rows if the function return true. By default only 'some' filter function
has to match for it to filter the row

## Type Parameters

| Type Parameter         |
| ---------------------- |
| `D` _extends_ `object` |

## Parameters

| Parameter | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `props`   | [`FilterSelectTableOptions`](../interfaces/FilterSelectTableOptions.md)\<`D`\> |

## Returns

`ReactElement`

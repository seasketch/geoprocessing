# ClassTable()

```ts
function ClassTable(props, deprecatedLegacyContext?): ReactNode
```

Table displaying class metrics, one class per table row.  Having more than one metric per class may yield unexpected results
Returns 0 value in table when faced with a 'missing' metric instead of erroring
Handles "class has no value" NaN situation (common when sketch doesn't overlap with a geography) by overwriting with 0 and adding information circle

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`ClassTableProps`](../interfaces/ClassTableProps.md) | - |
| `deprecatedLegacyContext`? | `any` | **Deprecated** **See** [React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods) |

## Returns

`ReactNode`

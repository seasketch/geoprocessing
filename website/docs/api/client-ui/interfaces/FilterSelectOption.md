# FilterSelectOption\<D\>

Custom table data filter

## Type Parameters

| Type Parameter         | Default type |
| ---------------------- | ------------ |
| `D` _extends_ `object` | `object`     |

## Properties

### defaultValue

```ts
defaultValue: boolean;
```

Whether to select by default

---

### filterFn()

```ts
filterFn: (row) => boolean;
```

The function used to filter the set.

#### Parameters

| Parameter | Type |
| --------- | ---- |
| `row`     | `D`  |

#### Returns

`boolean`

---

### name

```ts
name: string;
```

The label displayed for the select filter

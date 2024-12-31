# FilterSelect\<D\>

Custom table data filters that are only active when selected by the user

## Type Parameters

| Type Parameter         | Default type |
| ---------------------- | ------------ |
| `D` _extends_ `object` | `object`     |

## Properties

### filterPosition?

```ts
optional filterPosition: "bottom" | "top";
```

---

### filters

```ts
filters: FilterSelectOption < D > [];
```

filter functions called for every data row

---

### type?

```ts
optional type: "every" | "some";
```

Filter a row if `every` selected filter function returns true (logical AND), or at least `some` (logical OR)

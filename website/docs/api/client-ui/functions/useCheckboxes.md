# useCheckboxes()

```ts
function useCheckboxes(defaultState): object
```

Hook to maintain checkbox state

## Parameters

| Parameter | Type |
| ------ | ------ |
| `defaultState` | `Checkbox`[] |

## Returns

`object`

### checkboxes

```ts
checkboxes: Checkbox[];
```

### setCheckbox()

```ts
setCheckbox: (index, checked) => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `any` |
| `checked` | `any` |

#### Returns

`void`

# getIndexIconPerc()

```ts
function getIndexIconPerc(index): 
  | 0
  | 25
  | 50
  | 75
  | 100
```

Returns percent protection given index value,
percent is proportion (percent) of bottom color to top color to use for icon given index value (as shown in paper)
e.g. index = 5.4 means bottom icon color should take 25% of icon and top color 75%

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | classification index value for sketch collection |

## Returns

  \| `0`
  \| `25`
  \| `50`
  \| `75`
  \| `100`

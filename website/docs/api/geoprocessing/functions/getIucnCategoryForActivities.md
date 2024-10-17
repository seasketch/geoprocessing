# getIucnCategoryForActivities()

```ts
function getIucnCategoryForActivities(activities): IucnCategoryCombined
```

Given list of allowed activities in the sketch, returns the highest category allowable
The lack of an activity assumes it is not allowed

## Parameters

| Parameter | Type |
| ------ | ------ |
| `activities` | `string`[] |

## Returns

[`IucnCategoryCombined`](../interfaces/IucnCategoryCombined.md)

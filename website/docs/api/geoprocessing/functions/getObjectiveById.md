# getObjectiveById()

```ts
function getObjectiveById(objectiveId, objectives): object
```

find and return objectives from passed objectives

## Parameters

| Parameter | Type |
| ------ | ------ |
| `objectiveId` | `string` |
| `objectives` | `object`[] |

## Returns

`object`

### countsToward

```ts
countsToward: Record<string, "yes" | "no" | "maybe"> = objectiveAnswerMapSchema;
```

Generic map of group names (e.g. MPA protection levels) to whether they count towards objective

### objectiveId

```ts
objectiveId: string;
```

Unique identifier for objective

### shortDesc

```ts
shortDesc: string;
```

### target

```ts
target: number;
```

Value required for objective to be met

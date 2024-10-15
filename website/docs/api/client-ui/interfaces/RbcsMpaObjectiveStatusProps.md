# RbcsMpaObjectiveStatusProps

## Properties

### level

```ts
level:
  | "Fully Protected Area"
  | "Highly Protected Area"
  | "Moderately Protected Area"
  | "Poorly Protected Area"
  | "Unprotected Area";
```

RBCS protection level for MPA to give status for

---

### objective

```ts
objective: RbcsObjective;
```

RBCS objective to weigh protection level against

---

### renderMsg?

```ts
optional renderMsg: RbcsMpaObjectiveRenderMsgFunction;
```

optional custom objective message

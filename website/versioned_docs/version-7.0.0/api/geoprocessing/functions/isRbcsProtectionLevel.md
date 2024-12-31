# isRbcsProtectionLevel()

```ts
function isRbcsProtectionLevel(
  key,
): key is
  | "Fully Protected Area"
  | "Highly Protected Area"
  | "Moderately Protected Area"
  | "Poorly Protected Area"
  | "Unprotected Area";
```

Type guard for checking string is one of supported objective IDs
Use in conditional block logic to coerce to type RbcsObjectiveKey within the block

## Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

## Returns

key is "Fully Protected Area" \| "Highly Protected Area" \| "Moderately Protected Area" \| "Poorly Protected Area" \| "Unprotected Area"

# genTaskCacheKey()

```ts
function genTaskCacheKey(service, props, extraParams): string;
```

Generates a cache key for a geoprocessing request, given sketch properties and optional extra parameters (must be JSON compatible object)
Extra parameters are canonicalized and hashed using md5 to ensure cache key is consistent. Canonicalization ensures object keys are consistent
but not arrays. If you use arrays as extraParam values, make sure the order stays the same and sort first if needed to generate a consistent cache key.

## Parameters

| Parameter     | Type                                                      | Description                                    |
| ------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `service`     | `string`                                                  | -                                              |
| `props`       | [`SketchProperties`](../type-aliases/SketchProperties.md) | Properties of sketch to generate cache key for |
| `extraParams` | `Record`\<`string`, `unknown`\>                           | Extra parameters to include in cache key       |

## Returns

`string`

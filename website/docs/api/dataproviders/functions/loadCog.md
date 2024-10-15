# loadCog()

```ts
function loadCog(url): Promise<any>
```

Returns cog-aware georaster at given url.  Will not fetch raster values
until subsequent geoblaze calls are made with a geometry and it will
calculate the window to load based on the geometry.  The subsequent
geoblaze calls (e.g. sum) must be called async to allow the raster to load.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |

## Returns

`Promise`\<`any`\>

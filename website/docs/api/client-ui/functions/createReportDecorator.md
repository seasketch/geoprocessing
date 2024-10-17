# createReportDecorator()

```ts
function createReportDecorator(reportContext?): (storyFn) => Element
```

Think of this as a ReportDecorator generator, that allows you to pass in context and override the default
The only reason to use this instead of ReportDecorator directly is to pass context

## Parameters

| Parameter | Type |
| ------ | ------ |
| `reportContext`? | `Partial`\<[`ReportContextValue`](../../geoprocessing/interfaces/ReportContextValue.md)\> |

## Returns

`Function`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `storyFn` | `any` |

### Returns

`Element`

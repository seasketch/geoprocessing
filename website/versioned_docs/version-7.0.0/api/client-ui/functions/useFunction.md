# useFunction()

```ts
function useFunction<ResultType>(
  functionTitle,
  extraParams,
): FunctionState<ResultType>;
```

Runs the given geoprocessing function for the current sketch, as defined by ReportContext
During testing, useFunction will look for example output values in SketchContext.exampleOutputs

## Type Parameters

| Type Parameter |
| -------------- |
| `ResultType`   |

## Parameters

| Parameter       | Type                                                                                           | Description                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `functionTitle` | `string`                                                                                       | Title of geoprocessing function in this project to run. **Todo** support external project function                    |
| `extraParams`   | [`GeoprocessingRequestParams`](../../geoprocessing/type-aliases/GeoprocessingRequestParams.md) | Additional runtime parameters from report client for geoprocessing function. Validation left to implementing function |

## Returns

`FunctionState`\<`ResultType`\>

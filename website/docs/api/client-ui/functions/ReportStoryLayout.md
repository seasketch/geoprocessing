# ReportStoryLayout()

```ts
function ReportStoryLayout(props, deprecatedLegacyContext?): ReactNode
```

Wraps a story to look and behave like a sketch report
It also replicates much of the functionality of App.tx like setting text
direction and loading ReportContext.
The context value can be added to or overridden by passing a value prop
Layout includes a language switcher (connected to the report context)
and a report width selector
The caller must wrap the story in a Translator component to provide translations

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`ReportStoryLayoutProps`](../interfaces/ReportStoryLayoutProps.md) | - |
| `deprecatedLegacyContext`? | `any` | **Deprecated** **See** [React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods) |

## Returns

`ReactNode`

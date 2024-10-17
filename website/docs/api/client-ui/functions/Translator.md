# Translator()

```ts
function Translator(props, deprecatedLegacyContext?): ReactNode
```

Loads translations asynchronously using dynamic import abd react-i18next will have translations eventually and update
When language changes in context, the i18n instance will be updated and child components will update

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `object` | - |
| `props.children` | `ReactNode` | - |
| `deprecatedLegacyContext`? | `any` | **Deprecated** **See** [React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods) |

## Returns

`ReactNode`

# TableStyled()

## TableStyled(props)

```ts
function TableStyled<AsTarget, ForwardedAsTarget>(props): Element
```

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `AsTarget` *extends* `void` \| `WebTarget` | `void` |
| `ForwardedAsTarget` *extends* `void` \| `WebTarget` | `void` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `PolymorphicComponentProps`\<`"web"`, `FastOmit`\<`DetailedHTMLProps`\<`HTMLAttributes`\<`HTMLDivElement`\>, `HTMLDivElement`\>, `never`\>, `AsTarget`, `ForwardedAsTarget`, `AsTarget` *extends* `KnownTarget` ? `ComponentPropsWithRef`\<`AsTarget`\<`AsTarget`\>\> : `object`, `ForwardedAsTarget` *extends* `KnownTarget` ? `ComponentPropsWithRef`\<`ForwardedAsTarget`\<`ForwardedAsTarget`\>\> : `object`\> |

### Returns

`Element`

## TableStyled(props)

```ts
function TableStyled(props): ReactNode
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `FastOmit`\<`DetailedHTMLProps`\<`HTMLAttributes`\<`HTMLDivElement`\>, `HTMLDivElement`\>, `never`\> |

### Returns

`ReactNode`
# SimpleButtonStyled()

## SimpleButtonStyled(props)

```ts
function SimpleButtonStyled<AsTarget, ForwardedAsTarget>(props): Element;
```

### Type Parameters

| Type Parameter                                      | Default type |
| --------------------------------------------------- | ------------ |
| `AsTarget` _extends_ `void` \| `WebTarget`          | `void`       |
| `ForwardedAsTarget` _extends_ `void` \| `WebTarget` | `void`       |

### Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `props`   | `PolymorphicComponentProps`\<`"web"`, `FastOmit`\<`DetailedHTMLProps`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `HTMLButtonElement`\>, `never`\>, `AsTarget`, `ForwardedAsTarget`, `AsTarget` _extends_ `KnownTarget` ? `ComponentPropsWithRef`\<`AsTarget`\<`AsTarget`\>\> : `object`, `ForwardedAsTarget` _extends_ `KnownTarget` ? `ComponentPropsWithRef`\<`ForwardedAsTarget`\<`ForwardedAsTarget`\>\> : `object`\> |

### Returns

`Element`

## SimpleButtonStyled(props)

```ts
function SimpleButtonStyled(props): ReactNode;
```

### Parameters

| Parameter | Type                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| `props`   | `FastOmit`\<`DetailedHTMLProps`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>, `HTMLButtonElement`\>, `never`\> |

### Returns

`ReactNode`

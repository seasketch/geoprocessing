# ClassTableStyled()

## ClassTableStyled(props)

```ts
function ClassTableStyled<AsTarget, ForwardedAsTarget>(props): Element;
```

### Type Parameters

| Type Parameter                                      | Default type |
| --------------------------------------------------- | ------------ |
| `AsTarget` _extends_ `void` \| `WebTarget`          | `void`       |
| `ForwardedAsTarget` _extends_ `void` \| `WebTarget` | `void`       |

### Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `props`   | `PolymorphicComponentProps`\<`"web"`, `FastOmit`\<`Omit`\<`FastOmit`\<`DetailedHTMLProps`\<`HTMLAttributes`\<`HTMLDivElement`\>, `HTMLDivElement`\>, `never`\>, `"ref"`\> & `object`, `never`\>, `AsTarget`, `ForwardedAsTarget`, `AsTarget` _extends_ `KnownTarget` ? `ComponentPropsWithRef`\<`AsTarget`\<`AsTarget`\>\> : `object`, `ForwardedAsTarget` _extends_ `KnownTarget` ? `ComponentPropsWithRef`\<`ForwardedAsTarget`\<`ForwardedAsTarget`\>\> : `object`\> |

### Returns

`Element`

## ClassTableStyled(props)

```ts
function ClassTableStyled(props): ReactNode;
```

### Parameters

| Parameter | Type                                                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `props`   | `FastOmit`\<`Omit`\<`FastOmit`\<`DetailedHTMLProps`\<`HTMLAttributes`\<`HTMLDivElement`\>, `HTMLDivElement`\>, `never`\>, `"ref"`\> & `object`, `never`\> |

### Returns

`ReactNode`

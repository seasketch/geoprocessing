# Skeleton()

## Skeleton(props)

```ts
function Skeleton<AsTarget, ForwardedAsTarget>(props): Element;
```

### Type Parameters

| Type Parameter                                      | Default type |
| --------------------------------------------------- | ------------ |
| `AsTarget` _extends_ `void` \| `WebTarget`          | `void`       |
| `ForwardedAsTarget` _extends_ `void` \| `WebTarget` | `void`       |

### Parameters

| Parameter | Type                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `props`   | `PolymorphicComponentProps`\<`"web"`, `FastOmit`\<`DetailedHTMLProps`\<`HTMLAttributes`\<`HTMLDivElement`\>, `HTMLDivElement`\>, `never`\>, `AsTarget`, `ForwardedAsTarget`, `AsTarget` _extends_ `KnownTarget` ? `ComponentPropsWithRef`\<`AsTarget`\<`AsTarget`\>\> : `object`, `ForwardedAsTarget` _extends_ `KnownTarget` ? `ComponentPropsWithRef`\<`ForwardedAsTarget`\<`ForwardedAsTarget`\>\> : `object`\> |

### Returns

`Element`

## Skeleton(props)

```ts
function Skeleton(props): ReactNode;
```

### Parameters

| Parameter | Type                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `props`   | `FastOmit`\<`DetailedHTMLProps`\<`HTMLAttributes`\<`HTMLDivElement`\>, `HTMLDivElement`\>, `never`\> |

### Returns

`ReactNode`

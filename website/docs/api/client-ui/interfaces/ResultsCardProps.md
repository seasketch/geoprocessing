# ResultsCardProps\<T\>

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Properties

### children()

```ts
children: (results) => ReactNode;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `results` | `T` |

#### Returns

`ReactNode`

***

### extraParams?

```ts
optional extraParams: GeoprocessingRequestParams;
```

Additional runtime parameters from report client for geoprocessing function.

***

### functionName

```ts
functionName: string;
```

***

### skeleton?

```ts
optional skeleton: ReactNode;
```

***

### style?

```ts
optional style: object;
```

***

### title?

```ts
optional title: ReactNode;
```

***

### titleStyle?

```ts
optional titleStyle: CSSProperties;
```

***

### useChildCard?

```ts
optional useChildCard: boolean;
```

Assumes caller will provide card in children to use results (e.g. ToolbarCard with DataDownload). Shows a simple card until loading complete

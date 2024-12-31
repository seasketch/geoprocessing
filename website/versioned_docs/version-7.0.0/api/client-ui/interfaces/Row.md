# Row\<D\>

## Extends

- `UseTableRowProps`\<`D`\>.`UseExpandedRowProps`\<`D`\>.`UseGroupByRowProps`\<`D`\>.`UseRowSelectRowProps`\<`D`\>.`UseRowStateRowProps`\<`D`\>

## Type Parameters

| Type Parameter         | Default type |
| ---------------------- | ------------ |
| `D` _extends_ `object` | `object`     |

## Properties

### allCells

```ts
allCells: Cell < D, any > [];
```

#### Inherited from

`UseTableRowProps.allCells`

---

### canExpand

```ts
canExpand: boolean;
```

---

### cells

```ts
cells: Cell < D, any > [];
```

#### Inherited from

`UseTableRowProps.cells`

---

### depth

```ts
depth: number;
```

---

### getRowProps()

```ts
getRowProps: (propGetter?) => TableRowProps;
```

#### Parameters

| Parameter     | Type                   |
| ------------- | ---------------------- |
| `propGetter`? | `RowPropGetter`\<`D`\> |

#### Returns

`TableRowProps`

#### Inherited from

`UseTableRowProps.getRowProps`

---

### getToggleRowExpandedProps()

```ts
getToggleRowExpandedProps: (props?) => TableExpandedToggleProps;
```

#### Parameters

| Parameter | Type                                    |
| --------- | --------------------------------------- |
| `props`?  | `Partial`\<`TableExpandedToggleProps`\> |

#### Returns

`TableExpandedToggleProps`

---

### getToggleRowSelectedProps()

```ts
getToggleRowSelectedProps: (props?) => TableToggleRowsSelectedProps;
```

#### Parameters

| Parameter | Type                                        |
| --------- | ------------------------------------------- |
| `props`?  | `Partial`\<`TableToggleRowsSelectedProps`\> |

#### Returns

`TableToggleRowsSelectedProps`

---

### groupByID

```ts
groupByID: IdType<D>;
```

---

### groupByVal

```ts
groupByVal: string;
```

---

### id

```ts
id: string;
```

#### Inherited from

`UseTableRowProps.id`

---

### index

```ts
index: number;
```

#### Inherited from

`UseTableRowProps.index`

---

### isExpanded

```ts
isExpanded: boolean;
```

---

### isGrouped

```ts
isGrouped: boolean;
```

---

### isSelected

```ts
isSelected: boolean;
```

---

### isSomeSelected

```ts
isSomeSelected: boolean;
```

---

### leafRows

```ts
leafRows: Row < D > [];
```

---

### original

```ts
original: D;
```

#### Inherited from

`UseTableRowProps.original`

---

### setState()

```ts
setState: (updater) => void;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `updater` | `unknown` |

#### Returns

`void`

---

### state

```ts
state: UseRowStateLocalState<D, unknown>;
```

---

### subRows

```ts
subRows: Row < D > [];
```

#### Inherited from

`UseTableRowProps.subRows`

---

### toggleRowExpanded()

```ts
toggleRowExpanded: (value?) => void;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`?  | `boolean` |

#### Returns

`void`

---

### toggleRowSelected()

```ts
toggleRowSelected: (set?) => void;
```

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `set`?    | `boolean` |

#### Returns

`void`

---

### values

```ts
values: Record<IdType<D>, any>;
```

#### Inherited from

`UseTableRowProps.values`

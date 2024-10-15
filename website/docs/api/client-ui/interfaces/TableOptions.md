# TableOptions\<D\>

The empty definitions of below provides a base definition for the parts used by useTable, that can then be extended in the users code.

## Example

```ts
export interface TableOptions<D extends object = {}}>
   extends
     UseExpandedOptions<D>,
     UseFiltersOptions<D> {}
see https://gist.github.com/ggascoigne/646e14c9d54258e40588a13aabf0102d for more details
```

## Extends

- `UseTableOptions`\<`D`\>.`UseExpandedOptions`\<`D`\>.`UseGlobalFiltersOptions`\<`D`\>.`UsePaginationOptions`\<`D`\>.`UseSortByOptions`\<`D`\>

## Extended by

- [`FilterSelectTableOptions`](FilterSelectTableOptions.md)

## Type Parameters

| Type Parameter         |
| ---------------------- |
| `D` _extends_ `object` |

## Properties

### autoResetExpanded?

```ts
optional autoResetExpanded: boolean;
```

---

### autoResetGlobalFilter?

```ts
optional autoResetGlobalFilter: boolean;
```

---

### autoResetHiddenColumns?

```ts
optional autoResetHiddenColumns: boolean;
```

#### Inherited from

`UseTableOptions.autoResetHiddenColumns`

---

### autoResetPage?

```ts
optional autoResetPage: boolean;
```

---

### autoResetSortBy?

```ts
optional autoResetSortBy: boolean;
```

---

### cellProps()?

```ts
optional cellProps: (cell) => TableCommonProps;
```

Function called for each table cell allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `cell`    | `Cell`\<`D`, `any`\> |

#### Returns

`TableCommonProps`

---

### className?

```ts
optional className: string;
```

Optional method to pass style. Added to table element

---

### columnProps()?

```ts
optional columnProps: (column) => TableCommonProps;
```

Function called for each table column allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `column`  | [`Column`](../type-aliases/Column.md)\<`D`\> |

#### Returns

`TableCommonProps`

---

### columns

```ts
columns: readonly Column<D>[];
```

#### Inherited from

`UseTableOptions.columns`

---

### data

```ts
data: D[];
```

#### Inherited from

`UseTableOptions.data`

---

### defaultCanSort?

```ts
optional defaultCanSort: boolean;
```

---

### defaultColumn?

```ts
optional defaultColumn: Partial<Column<D>>;
```

#### Inherited from

`UseTableOptions.defaultColumn`

---

### disabledMultiRemove?

```ts
optional disabledMultiRemove: boolean;
```

---

### disableGlobalFilter?

```ts
optional disableGlobalFilter: boolean;
```

---

### disableMultiSort?

```ts
optional disableMultiSort: boolean;
```

---

### disableSortBy?

```ts
optional disableSortBy: boolean;
```

---

### disableSortRemove?

```ts
optional disableSortRemove: boolean;
```

---

### downloadEnabled?

```ts
optional downloadEnabled: boolean;
```

Enable toolbar with download option

---

### downloadFilename?

```ts
optional downloadFilename: string;
```

---

### downloadFormats?

```ts
optional downloadFormats: ("json" | "csv")[];
```

---

### expandSubRows?

```ts
optional expandSubRows: boolean;
```

---

### filterTypes?

```ts
optional filterTypes: FilterTypes<D>;
```

---

### getRowId()?

```ts
optional getRowId: (originalRow, relativeIndex, parent?) => string;
```

#### Parameters

| Parameter       | Type                   |
| --------------- | ---------------------- |
| `originalRow`   | `D`                    |
| `relativeIndex` | `number`               |
| `parent`?       | [`Row`](Row.md)\<`D`\> |

#### Returns

`string`

#### Inherited from

`UseTableOptions.getRowId`

---

### getSubRows()?

```ts
optional getSubRows: (originalRow, relativeIndex) => D[];
```

#### Parameters

| Parameter       | Type     |
| --------------- | -------- |
| `originalRow`   | `D`      |
| `relativeIndex` | `number` |

#### Returns

`D`[]

#### Inherited from

`UseTableOptions.getSubRows`

---

### globalFilter?

```ts
optional globalFilter: string | (rows, columnIds, filterValue) => Row<D>[];
```

---

### headerProps()?

```ts
optional headerProps: (header) => TableCommonProps;
```

Function called for each table header allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `header`  | `HeaderGroup`\<`D`\> |

#### Returns

`TableCommonProps`

---

### initialState?

```ts
optional initialState: Partial<TableState<D>>;
```

#### Inherited from

`UseTableOptions.initialState`

---

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

#### Parameters

| Parameter | Type                                    |
| --------- | --------------------------------------- |
| `e`       | `MouseEvent`\<`Element`, `MouseEvent`\> |

#### Returns

`boolean`

---

### manualExpandedKey?

```ts
optional manualExpandedKey: IdType<D>;
```

---

### manualGlobalFilter?

```ts
optional manualGlobalFilter: boolean;
```

---

### manualPagination?

```ts
optional manualPagination: boolean;
```

---

### manualSortBy?

```ts
optional manualSortBy: boolean;
```

---

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

---

### orderByFn()?

```ts
optional orderByFn: (rows, sortFns, directions) => Row<D>[];
```

#### Parameters

| Parameter    | Type                     |
| ------------ | ------------------------ |
| `rows`       | [`Row`](Row.md)\<`D`\>[] |
| `sortFns`    | `OrderByFn`\<`D`\>[]     |
| `directions` | `boolean`[]              |

#### Returns

[`Row`](Row.md)\<`D`\>[]

---

### pageCount?

```ts
optional pageCount: number;
```

---

### paginateExpandedRows?

```ts
optional paginateExpandedRows: boolean;
```

---

### rowProps()?

```ts
optional rowProps: (row) => TableCommonProps;
```

Function called for each table row allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type                   |
| --------- | ---------------------- |
| `row`     | [`Row`](Row.md)\<`D`\> |

#### Returns

`TableCommonProps`

---

### sortTypes?

```ts
optional sortTypes: Record<string, SortByFn<D>>;
```

---

### stateReducer()?

```ts
optional stateReducer: (newState, action, previousState, instance?) => TableState<D>;
```

#### Parameters

| Parameter       | Type                   |
| --------------- | ---------------------- |
| `newState`      | `TableState`\<`D`\>    |
| `action`        | `ActionType`           |
| `previousState` | `TableState`\<`D`\>    |
| `instance`?     | `TableInstance`\<`D`\> |

#### Returns

`TableState`\<`D`\>

#### Inherited from

`UseTableOptions.stateReducer`

---

### title?

```ts
optional title: ReactNode;
```

Toolbar title

---

### useControlledState()?

```ts
optional useControlledState: (state, meta) => TableState<D>;
```

#### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `state`   | `TableState`\<`D`\> |
| `meta`    | `MetaBase`\<`D`\>   |

#### Returns

`TableState`\<`D`\>

#### Inherited from

`UseTableOptions.useControlledState`

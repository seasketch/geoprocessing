# FilterSelectTableOptions\<D\>

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

- [`TableOptions`](TableOptions.md)\<`D`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `D` *extends* `object` | `object` |

## Properties

### autoResetExpanded?

```ts
optional autoResetExpanded: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`autoResetExpanded`](TableOptions.md#autoresetexpanded)

***

### autoResetGlobalFilter?

```ts
optional autoResetGlobalFilter: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`autoResetGlobalFilter`](TableOptions.md#autoresetglobalfilter)

***

### autoResetHiddenColumns?

```ts
optional autoResetHiddenColumns: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`autoResetHiddenColumns`](TableOptions.md#autoresethiddencolumns)

***

### autoResetPage?

```ts
optional autoResetPage: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`autoResetPage`](TableOptions.md#autoresetpage)

***

### autoResetSortBy?

```ts
optional autoResetSortBy: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`autoResetSortBy`](TableOptions.md#autoresetsortby)

***

### cellProps()?

```ts
optional cellProps: (cell) => TableCommonProps;
```

Function called for each table cell allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cell` | `Cell`\<`D`, `any`\> |

#### Returns

`TableCommonProps`

#### Inherited from

[`TableOptions`](TableOptions.md).[`cellProps`](TableOptions.md#cellprops)

***

### className?

```ts
optional className: string;
```

Optional method to pass style.  Added to table element

#### Inherited from

[`TableOptions`](TableOptions.md).[`className`](TableOptions.md#classname)

***

### columnProps()?

```ts
optional columnProps: (column) => TableCommonProps;
```

Function called for each table column allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `column` | [`Column`](../type-aliases/Column.md)\<`D`\> |

#### Returns

`TableCommonProps`

#### Inherited from

[`TableOptions`](TableOptions.md).[`columnProps`](TableOptions.md#columnprops)

***

### columns

```ts
columns: readonly Column<D>[];
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`columns`](TableOptions.md#columns)

***

### data

```ts
data: D[];
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`data`](TableOptions.md#data)

***

### defaultCanSort?

```ts
optional defaultCanSort: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`defaultCanSort`](TableOptions.md#defaultcansort)

***

### defaultColumn?

```ts
optional defaultColumn: Partial<Column<D>>;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`defaultColumn`](TableOptions.md#defaultcolumn)

***

### disabledMultiRemove?

```ts
optional disabledMultiRemove: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`disabledMultiRemove`](TableOptions.md#disabledmultiremove)

***

### disableGlobalFilter?

```ts
optional disableGlobalFilter: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`disableGlobalFilter`](TableOptions.md#disableglobalfilter)

***

### disableMultiSort?

```ts
optional disableMultiSort: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`disableMultiSort`](TableOptions.md#disablemultisort)

***

### disableSortBy?

```ts
optional disableSortBy: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`disableSortBy`](TableOptions.md#disablesortby)

***

### disableSortRemove?

```ts
optional disableSortRemove: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`disableSortRemove`](TableOptions.md#disablesortremove)

***

### downloadEnabled?

```ts
optional downloadEnabled: boolean;
```

Enable toolbar with download option

#### Inherited from

[`TableOptions`](TableOptions.md).[`downloadEnabled`](TableOptions.md#downloadenabled)

***

### downloadFilename?

```ts
optional downloadFilename: string;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`downloadFilename`](TableOptions.md#downloadfilename)

***

### downloadFormats?

```ts
optional downloadFormats: ("json" | "csv")[];
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`downloadFormats`](TableOptions.md#downloadformats)

***

### expandSubRows?

```ts
optional expandSubRows: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`expandSubRows`](TableOptions.md#expandsubrows)

***

### filterSelect

```ts
filterSelect: FilterSelect<D>;
```

***

### filterTypes?

```ts
optional filterTypes: FilterTypes<D>;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`filterTypes`](TableOptions.md#filtertypes)

***

### getRowId()?

```ts
optional getRowId: (originalRow, relativeIndex, parent?) => string;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalRow` | `D` |
| `relativeIndex` | `number` |
| `parent`? | [`Row`](Row.md)\<`D`\> |

#### Returns

`string`

#### Inherited from

[`TableOptions`](TableOptions.md).[`getRowId`](TableOptions.md#getrowid)

***

### getSubRows()?

```ts
optional getSubRows: (originalRow, relativeIndex) => D[];
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `originalRow` | `D` |
| `relativeIndex` | `number` |

#### Returns

`D`[]

#### Inherited from

[`TableOptions`](TableOptions.md).[`getSubRows`](TableOptions.md#getsubrows)

***

### globalFilter?

```ts
optional globalFilter: string | (rows, columnIds, filterValue) => Row<D>[];
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`globalFilter`](TableOptions.md#globalfilter)

***

### headerProps()?

```ts
optional headerProps: (header) => TableCommonProps;
```

Function called for each table header allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `header` | `HeaderGroup`\<`D`\> |

#### Returns

`TableCommonProps`

#### Inherited from

[`TableOptions`](TableOptions.md).[`headerProps`](TableOptions.md#headerprops)

***

### initialState?

```ts
optional initialState: Partial<TableState<D>>;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`initialState`](TableOptions.md#initialstate)

***

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | `MouseEvent`\<`Element`, `MouseEvent`\> |

#### Returns

`boolean`

#### Inherited from

[`TableOptions`](TableOptions.md).[`isMultiSortEvent`](TableOptions.md#ismultisortevent)

***

### manualExpandedKey?

```ts
optional manualExpandedKey: IdType<D>;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`manualExpandedKey`](TableOptions.md#manualexpandedkey)

***

### manualGlobalFilter?

```ts
optional manualGlobalFilter: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`manualGlobalFilter`](TableOptions.md#manualglobalfilter)

***

### manualPagination?

```ts
optional manualPagination: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`manualPagination`](TableOptions.md#manualpagination)

***

### manualSortBy?

```ts
optional manualSortBy: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`manualSortBy`](TableOptions.md#manualsortby)

***

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`maxMultiSortColCount`](TableOptions.md#maxmultisortcolcount)

***

### orderByFn()?

```ts
optional orderByFn: (rows, sortFns, directions) => Row<D>[];
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rows` | [`Row`](Row.md)\<`D`\>[] |
| `sortFns` | `OrderByFn`\<`D`\>[] |
| `directions` | `boolean`[] |

#### Returns

[`Row`](Row.md)\<`D`\>[]

#### Inherited from

[`TableOptions`](TableOptions.md).[`orderByFn`](TableOptions.md#orderbyfn)

***

### pageCount?

```ts
optional pageCount: number;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`pageCount`](TableOptions.md#pagecount)

***

### paginateExpandedRows?

```ts
optional paginateExpandedRows: boolean;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`paginateExpandedRows`](TableOptions.md#paginateexpandedrows)

***

### rowProps()?

```ts
optional rowProps: (row) => TableCommonProps;
```

Function called for each table row allowing style/className/role props to be overridden

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `row` | [`Row`](Row.md)\<`D`\> |

#### Returns

`TableCommonProps`

#### Inherited from

[`TableOptions`](TableOptions.md).[`rowProps`](TableOptions.md#rowprops)

***

### sortTypes?

```ts
optional sortTypes: Record<string, SortByFn<D>>;
```

#### Inherited from

[`TableOptions`](TableOptions.md).[`sortTypes`](TableOptions.md#sorttypes)

***

### stateReducer()?

```ts
optional stateReducer: (newState, action, previousState, instance?) => TableState<D>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `newState` | `TableState`\<`D`\> |
| `action` | `ActionType` |
| `previousState` | `TableState`\<`D`\> |
| `instance`? | `TableInstance`\<`D`\> |

#### Returns

`TableState`\<`D`\>

#### Inherited from

[`TableOptions`](TableOptions.md).[`stateReducer`](TableOptions.md#statereducer)

***

### title?

```ts
optional title: ReactNode;
```

Toolbar title

#### Inherited from

[`TableOptions`](TableOptions.md).[`title`](TableOptions.md#title)

***

### useControlledState()?

```ts
optional useControlledState: (state, meta) => TableState<D>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `TableState`\<`D`\> |
| `meta` | `MetaBase`\<`D`\> |

#### Returns

`TableState`\<`D`\>

#### Inherited from

[`TableOptions`](TableOptions.md).[`useControlledState`](TableOptions.md#usecontrolledstate)

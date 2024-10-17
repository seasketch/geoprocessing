# DataDownloadToolbarProps

## Extends

- [`DataDownloadProps`](DataDownloadProps.md).`Omit`\<[`ToolbarProps`](ToolbarProps.md), `"toolbarCls"` \| `"children"`\>

## Properties

### addSketchName?

```ts
optional addSketchName: boolean;
```

Add sketch name to filename, default to true

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`addSketchName`](DataDownloadProps.md#addsketchname)

***

### addTimestamp?

```ts
optional addTimestamp: boolean;
```

Add timestamp to filename, defaults to true

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`addTimestamp`](DataDownloadProps.md#addtimestamp)

***

### data

```ts
data: object[];
```

Raw data to format and allow to download, nested objects and arrays will get flattened

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`data`](DataDownloadProps.md#data)

***

### filename?

```ts
optional filename: string;
```

Name minus extension

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`filename`](DataDownloadProps.md#filename)

***

### formats?

```ts
optional formats: ("json" | "csv")[];
```

Formats to offer, defaults to csv only

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`formats`](DataDownloadProps.md#formats)

***

### offset?

```ts
optional offset: object;
```

#### horizontal

```ts
horizontal: number;
```

#### vertical

```ts
vertical: number;
```

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`offset`](DataDownloadProps.md#offset)

***

### placement?

```ts
optional placement: Placement;
```

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`placement`](DataDownloadProps.md#placement)

***

### style?

```ts
optional style: CSSProperties;
```

#### Inherited from

`Omit.style`

***

### title

```ts
title: string;
```

***

### titleAlign?

```ts
optional titleAlign: 
  | "center"
  | "stretch"
  | "flex-end"
  | "flex-start"
  | "baseline";
```

#### Inherited from

`Omit.titleAlign`

***

### titleElement?

```ts
optional titleElement: Element;
```

#### Inherited from

[`DataDownloadProps`](DataDownloadProps.md).[`titleElement`](DataDownloadProps.md#titleelement)

***

### useGutters?

```ts
optional useGutters: boolean;
```

#### Inherited from

`Omit.useGutters`

***

### variant?

```ts
optional variant: "min" | "dense" | "regular";
```

defaults to regular height, dense is smaller height, min is height of toolbar items

#### Inherited from

`Omit.variant`

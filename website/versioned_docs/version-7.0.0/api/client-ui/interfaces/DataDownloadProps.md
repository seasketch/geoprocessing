# DataDownloadProps

## Extends

- `DataDownloadDropdownProps`

## Extended by

- [`DataDownloadToolbarProps`](DataDownloadToolbarProps.md)

## Properties

### addSketchName?

```ts
optional addSketchName: boolean;
```

Add sketch name to filename, default to true

---

### addTimestamp?

```ts
optional addTimestamp: boolean;
```

Add timestamp to filename, defaults to true

---

### data

```ts
data: object[];
```

Raw data to format and allow to download, nested objects and arrays will get flattened

---

### filename?

```ts
optional filename: string;
```

Name minus extension

---

### formats?

```ts
optional formats: ("json" | "csv")[];
```

Formats to offer, defaults to csv only

---

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

`DataDownloadDropdownProps.offset`

---

### placement?

```ts
optional placement: Placement;
```

#### Inherited from

`DataDownloadDropdownProps.placement`

---

### titleElement?

```ts
optional titleElement: Element;
```

#### Overrides

`DataDownloadDropdownProps.titleElement`

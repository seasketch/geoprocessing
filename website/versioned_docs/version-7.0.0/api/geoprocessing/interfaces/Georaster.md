# Georaster

## Properties

### getValues()?

```ts
optional getValues: (options) => Promise<TypedArray[][]>;
```

if raster initialized with a URL, this method is available to fetch a
specific subset or 'window' without reading the entire raster into memory.
If the window options do not align exactly with the source image then a new
one is generated using the resampleMethod. The best available overview will
also be used if they are available.

#### Parameters

| Parameter | Type                                |
| --------- | ----------------------------------- |
| `options` | [`WindowOptions`](WindowOptions.md) |

#### Returns

`Promise`\<[`TypedArray`](../type-aliases/TypedArray.md)[][]\>

---

### height

```ts
height: number;
```

raster height in units of projection

---

### maxs

```ts
maxs: number[];
```

Maximum cell value for each raster band. Indexed by band number

---

### mins

```ts
mins: number[];
```

Minimum cell value for each raster band. Indexed by band number

---

### noDataValue

```ts
noDataValue: number;
```

cell value representing "no data" in raster

---

### numberOfRasters

```ts
numberOfRasters: number;
```

number of raster bands

---

### pixelHeight

```ts
pixelHeight: number;
```

raster height in pixels

---

### pixelWidth

```ts
pixelWidth: number;
```

raster width in pixels

---

### projection

```ts
projection: number;
```

Projection identifier

---

### ranges

```ts
ranges: number[];
```

difference between max and min for each raster band. Indexed by band number

---

### toCanvas()

```ts
toCanvas: (options) => ImageData;
```

experimental! returns a canvas picture of the data.

#### Parameters

| Parameter         | Type     |
| ----------------- | -------- |
| `options`         | `object` |
| `options.height`? | `number` |
| `options.width`?  | `number` |

#### Returns

`ImageData`

---

### values

```ts
values: TypedArray[][];
```

raster values for one or more bands. Represented as [band, column, row]

---

### width

```ts
width: number;
```

raster width in units of projection

---

### xmax

```ts
xmax: number;
```

right boundary, in units of projection

---

### xmin

```ts
xmin: number;
```

left boundary, in units of projection

---

### ymax

```ts
ymax: number;
```

top boundary, in units of projection

---

### ymin

```ts
ymin: number;
```

bottom boundary, in units of projection

# WindowOptions

defines the new raster image to generate as a window in the source raster image. Resolution (cell size) is determined from this

## Properties

### bottom

```ts
bottom: number;
```

bottom of the image window in pixel coordinates. Should be greater than top

---

### height

```ts
height: number;
```

height in pixels to make the resulting raster. Will resample and/or use overview if not same as bottom - top

---

### left

```ts
left: number;
```

left side of the image window in pixel coordinates

---

### resampleMethod?

```ts
optional resampleMethod: string;
```

method to map src raster values to result raster. Supports 'nearest' neighbor, defaults to 'bilinear'

---

### right

```ts
right: number;
```

right of the image window in pixel coordinates. Should be greater than left

---

### top

```ts
top: number;
```

top of the image window in pixel coordinates

---

### width

```ts
width: number;
```

width in pixels to make the resulting raster. Will resample and/or use overview if not same as right - left

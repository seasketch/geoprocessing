# HorizontalStackedBarProps

## Properties

### barHeight?

```ts
optional barHeight: number;
```

---

### blockGroupNames

```ts
blockGroupNames: string[];
```

---

### blockGroupStyles?

```ts
optional blockGroupStyles: CSSProperties[];
```

Style for each block group

---

### max

```ts
max: number;
```

Maximum value for each row

---

### rowConfigs

```ts
rowConfigs: RowConfig[];
```

row config

---

### rows

```ts
rows: HorizontalStackedBarRow[];
```

row data

---

### showLegend?

```ts
optional showLegend: boolean;
```

---

### showTargetLabel?

```ts
optional showTargetLabel: boolean;
```

---

### showTitle?

```ts
optional showTitle: boolean;
```

---

### showTotalLabel?

```ts
optional showTotalLabel: boolean;
```

---

### target?

```ts
optional target: number;
```

---

### targetLabelPosition?

```ts
optional targetLabelPosition: "bottom" | "top";
```

---

### targetLabelStyle?

```ts
optional targetLabelStyle: "normal" | "tight";
```

---

### targetReachedColor?

```ts
optional targetReachedColor: string;
```

---

### targetValueFormatter()?

```ts
optional targetValueFormatter: (value) => string | Element;
```

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `value`   | `number` |

#### Returns

`string` \| `Element`

---

### titleWidth?

```ts
optional titleWidth: number;
```

---

### valueFormatter()?

```ts
optional valueFormatter: (value) => string | Element;
```

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `value`   | `number` |

#### Returns

`string` \| `Element`

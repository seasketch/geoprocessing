# PercentEdgeOptions

## Properties

### digits?

```ts
optional digits: number;
```

Number of decimal digits to round value to if is within lower or upper edge range.  defaults to 1.  Override with this option

***

### digitsIfMatchLower?

```ts
optional digitsIfMatchLower: number;
```

Number of decimal digits to round value to if exactly matches lowerBound, defaults to 0 (whole number)

***

### lower?

```ts
optional lower: number;
```

Enable special formatting of values from lowerBound up to lower value.  Defaults to .001 aka 1/10 of a percent

***

### lowerBound?

```ts
optional lowerBound: number;
```

Define a lower value bound.  Defaults to 0 (zero).

***

### lowerOverride?

```ts
optional lowerOverride: string;
```

Optional string value to display if between zero and lower.  Overrides default special handling, no use of percent formatter.  Example - "< 0.1% for real"

***

### upper?

```ts
optional upper: number;
```

Define lower bound to upper value.  Enable special formatting of values from upper to upperBound

***

### upperBound?

```ts
optional upperBound: number;
```

Define an upper value bound.  Enable special formatting of values from upper to upperBound

***

### upperOverride?

```ts
optional upperOverride: string;
```

Optional string value to display if between upper and upperBound.  Overrides default special handling, no use of percent formatter.  Example - "almost 20%, keep going!"

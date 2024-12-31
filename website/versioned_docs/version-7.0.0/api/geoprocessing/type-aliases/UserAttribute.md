# UserAttribute

```ts
type UserAttribute: Record<string, unknown> & object;
```

User-defined attributes with values for Sketch. Defines known keys as well as unknown for extensiblity

## Type declaration

### alternateLanguages?

```ts
optional alternateLanguages: Record<string, object>;
```

Alternative strings to display for sketch attribute by language code

### exportId

```ts
exportId: string;
```

### fieldType

```ts
fieldType: string;
```

### label

```ts
label: string;
```

String to display for sketch attribute name

### value

```ts
value:
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | null;
```

Sketch attribute value

### valueLabel?

```ts
optional valueLabel: string | string[] | null;
```

String to display for sketch attribute value

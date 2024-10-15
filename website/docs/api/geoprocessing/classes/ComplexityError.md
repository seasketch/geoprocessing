# ComplexityError

Error signifying function threw due to not being able to handle the input - e.g. size/complexity

## Extends

- `Error`

## Constructors

### new ComplexityError()

```ts
new ComplexityError(message?): ComplexityError
```

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `message`? | `string` |

#### Returns

[`ComplexityError`](ComplexityError.md)

#### Inherited from

`Error.constructor`

### new ComplexityError()

```ts
new ComplexityError(message?, options?): ComplexityError
```

#### Parameters

| Parameter  | Type           |
| ---------- | -------------- |
| `message`? | `string`       |
| `options`? | `ErrorOptions` |

#### Returns

[`ComplexityError`](ComplexityError.md)

#### Inherited from

`Error.constructor`

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

#### Parameters

| Parameter         | Type       |
| ----------------- | ---------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

## Properties

### cause?

```ts
optional cause: unknown;
```

#### Inherited from

`Error.cause`

---

### message

```ts
message: string;
```

#### Inherited from

`Error.message`

---

### name

```ts
name: string;
```

#### Inherited from

`Error.name`

---

### stack?

```ts
optional stack: string;
```

#### Inherited from

`Error.stack`

---

### prepareStackTrace()?

```ts
static optional prepareStackTrace: (err, stackTraces) => any;
```

Optional override for formatting stack traces

#### Parameters

| Parameter     | Type         |
| ------------- | ------------ |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

---

### stackTraceLimit

```ts
static stackTraceLimit: number;
```

#### Inherited from

`Error.stackTraceLimit`

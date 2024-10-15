# ReportError

## Extends

- `Component`\<`ReportErrorProps`, `ReportErrorState`\>

## Constructors

### new ReportError()

```ts
new ReportError(props): ReportError
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `ReportErrorProps` |

#### Returns

[`ReportError`](ReportError.md)

#### Inherited from

`React.Component<
  ReportErrorProps,
  ReportErrorState
>.constructor`

### new ReportError()

```ts
new ReportError(props, context): ReportError
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `ReportErrorProps` |
| `context` | `any` |

#### Returns

[`ReportError`](ReportError.md)

#### Deprecated

#### See

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html)

#### Inherited from

`React.Component<
  ReportErrorProps,
  ReportErrorState
>.constructor`

## Methods

### componentDidCatch()

```ts
componentDidCatch(error, info): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `any` |
| `info` | `any` |

#### Returns

`void`

#### Overrides

`React.Component.componentDidCatch`

***

### componentDidMount()?

```ts
optional componentDidMount(): void
```

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

#### Returns

`void`

#### Inherited from

`React.Component.componentDidMount`

***

### componentDidUpdate()?

```ts
optional componentDidUpdate(
   prevProps, 
   prevState, 
   snapshot?): void
```

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if [getSnapshotBeforeUpdate](ReportError.md#getsnapshotbeforeupdate) is present and returns non-null.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prevProps` | `Readonly`\<`ReportErrorProps`\> |
| `prevState` | `Readonly`\<`ReportErrorState`\> |
| `snapshot`? | `any` |

#### Returns

`void`

#### Inherited from

`React.Component.componentDidUpdate`

***

### ~~componentWillMount()?~~

```ts
optional componentWillMount(): void
```

Called immediately before mounting occurs, and before Component.render.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Returns

`void`

#### Deprecated

16.3, use ComponentLifecycle.componentDidMount componentDidMount or the constructor instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.componentWillMount`

***

### ~~componentWillReceiveProps()?~~

```ts
optional componentWillReceiveProps(nextProps, nextContext): void
```

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling Component.setState generally does not trigger this method.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`ReportErrorProps`\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use static StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.componentWillReceiveProps`

***

### componentWillUnmount()?

```ts
optional componentWillUnmount(): void
```

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

#### Returns

`void`

#### Inherited from

`React.Component.componentWillUnmount`

***

### ~~componentWillUpdate()?~~

```ts
optional componentWillUpdate(
   nextProps, 
   nextState, 
   nextContext): void
```

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call Component.setState here.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`ReportErrorProps`\> |
| `nextState` | `Readonly`\<`ReportErrorState`\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.componentWillUpdate`

***

### forceUpdate()

```ts
forceUpdate(callback?): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback`? | () => `void` |

#### Returns

`void`

#### Inherited from

`React.Component.forceUpdate`

***

### getSnapshotBeforeUpdate()?

```ts
optional getSnapshotBeforeUpdate(prevProps, prevState): any
```

Runs before React applies the result of Component.render render to the document, and
returns an object to be given to [componentDidUpdate](ReportError.md#componentdidupdate). Useful for saving
things such as scroll position before Component.render render causes changes to it.

Note: the presence of this method prevents any of the deprecated
lifecycle events from running.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prevProps` | `Readonly`\<`ReportErrorProps`\> |
| `prevState` | `Readonly`\<`ReportErrorState`\> |

#### Returns

`any`

#### Inherited from

`React.Component.getSnapshotBeforeUpdate`

***

### render()

```ts
render(): 
  | undefined
  | null
  | string
  | number
  | boolean
  | Iterable<ReactNode>
  | Element
```

#### Returns

  \| `undefined`
  \| `null`
  \| `string`
  \| `number`
  \| `boolean`
  \| `Iterable`\<`ReactNode`\>
  \| `Element`

#### Overrides

`React.Component.render`

***

### setState()

```ts
setState<K>(state, callback?): void
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `ReportErrorState` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `null` \| `ReportErrorState` \| (`prevState`, `props`) => `null` \| `ReportErrorState` \| `Pick`\<`ReportErrorState`, `K`\> \| `Pick`\<`ReportErrorState`, `K`\> |
| `callback`? | () => `void` |

#### Returns

`void`

#### Inherited from

`React.Component.setState`

***

### shouldComponentUpdate()?

```ts
optional shouldComponentUpdate(
   nextProps, 
   nextState, 
   nextContext): boolean
```

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, Component.render, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`ReportErrorProps`\> |
| `nextState` | `Readonly`\<`ReportErrorState`\> |
| `nextContext` | `any` |

#### Returns

`boolean`

#### Inherited from

`React.Component.shouldComponentUpdate`

***

### ~~UNSAFE\_componentWillMount()?~~

```ts
optional UNSAFE_componentWillMount(): void
```

Called immediately before mounting occurs, and before Component.render.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Returns

`void`

#### Deprecated

16.3, use ComponentLifecycle.componentDidMount componentDidMount or the constructor instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.UNSAFE_componentWillMount`

***

### ~~UNSAFE\_componentWillReceiveProps()?~~

```ts
optional UNSAFE_componentWillReceiveProps(nextProps, nextContext): void
```

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling Component.setState generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`ReportErrorProps`\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use static StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.UNSAFE_componentWillReceiveProps`

***

### ~~UNSAFE\_componentWillUpdate()?~~

```ts
optional UNSAFE_componentWillUpdate(
   nextProps, 
   nextState, 
   nextContext): void
```

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call Component.setState here.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nextProps` | `Readonly`\<`ReportErrorProps`\> |
| `nextState` | `Readonly`\<`ReportErrorState`\> |
| `nextContext` | `any` |

#### Returns

`void`

#### Deprecated

16.3, use getSnapshotBeforeUpdate instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`React.Component.UNSAFE_componentWillUpdate`

***

### getDerivedStateFromError()

```ts
static getDerivedStateFromError(): object
```

#### Returns

`object`

##### hasError

```ts
hasError: boolean = true;
```

## Properties

### context

```ts
context: unknown;
```

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

#### Example

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

#### See

[React Docs](https://react.dev/reference/react/Component#context)

#### Inherited from

`React.Component.context`

***

### props

```ts
readonly props: Readonly<ReportErrorProps>;
```

#### Inherited from

`React.Component.props`

***

### ~~refs~~

```ts
refs: object;
```

#### Index Signature

 \[`key`: `string`\]: `ReactInstance`

#### Deprecated

#### See

[Legacy React Docs](https://legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)

#### Inherited from

`React.Component.refs`

***

### state

```ts
state: object;
```

#### error

```ts
error: object;
```

#### error.message

```ts
message: string = "";
```

#### error.stack

```ts
stack: string = "";
```

#### hasError

```ts
hasError: boolean = false;
```

#### info

```ts
info: object;
```

#### info.componentStack

```ts
componentStack: string = "";
```

#### Overrides

`React.Component.state`

***

### contextType?

```ts
static optional contextType: Context<any>;
```

If set, `this.context` will be set at runtime to the current value of the given Context.

#### Example

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

#### See

[https://react.dev/reference/react/Component#static-contexttype](https://react.dev/reference/react/Component#static-contexttype)

#### Inherited from

`React.Component.contextType`

***

### propTypes

```ts
static propTypes: object;
```

#### children

```ts
children: Requireable<ReactNodeLike>;
```

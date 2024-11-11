# GeoprocessingServiceMetadata

Expected public service metadata for each function

## Extends

- [`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md)

## Properties

### clientSideBundle?

```ts
optional clientSideBundle: ClientCode;
```

***

### description

```ts
description: string;
```

Appears in service metadata

#### Inherited from

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`description`](GeoprocessingHandlerOptions.md#description)

***

### endpoint

```ts
endpoint: string;
```

***

### executionMode

```ts
executionMode: ExecutionMode;
```

Choose `sync` for functions that are expected to return quickly (< 2s)
and `async` for longer running functions, especially contain/docker jobs.

#### Inherited from

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`executionMode`](GeoprocessingHandlerOptions.md#executionmode)

***

### issAllowList

```ts
issAllowList: string[];
```

List domains, e.g. myproject.seasketch.org.
When restrictedAccess is enabled, this function can be configured to only
work with specified projects.

#### Overrides

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`issAllowList`](GeoprocessingHandlerOptions.md#issallowlist)

***

### medianCost

```ts
medianCost: number;
```

USD

***

### medianDuration

```ts
medianDuration: number;
```

Seconds

***

### memory?

```ts
optional memory: number;
```

Megabytes, 128 - 3008

#### Inherited from

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`memory`](GeoprocessingHandlerOptions.md#memory)

***

### rateLimit

```ts
rateLimit: number;
```

#### Overrides

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`rateLimit`](GeoprocessingHandlerOptions.md#ratelimit)

***

### rateLimitConsumed

```ts
rateLimitConsumed: number;
```

***

### rateLimited

```ts
rateLimited: boolean;
```

Whether to rate limit beyond basic DDoS protection

#### Overrides

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`rateLimited`](GeoprocessingHandlerOptions.md#ratelimited)

***

### rateLimitPeriod

```ts
rateLimitPeriod: RateLimitPeriod;
```

`daily` or `monthly`

#### Overrides

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`rateLimitPeriod`](GeoprocessingHandlerOptions.md#ratelimitperiod)

***

### requiresProperties?

```ts
optional requiresProperties: string[];
```

Specify the ids of any Sketch Class form fields that must be provided in
order to run the function

#### Inherited from

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`requiresProperties`](GeoprocessingHandlerOptions.md#requiresproperties)

***

### restrictedAccess?

```ts
optional restrictedAccess: boolean;
```

Whether function should respect group access-control headers

#### Overrides

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`restrictedAccess`](GeoprocessingHandlerOptions.md#restrictedaccess)

***

### timeout

```ts
timeout: number;
```

Seconds

#### Inherited from

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`timeout`](GeoprocessingHandlerOptions.md#timeout)

***

### title

```ts
title: string;
```

Title will appear in service metadata and be referenced by clients

#### Inherited from

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`title`](GeoprocessingHandlerOptions.md#title)

***

### type

```ts
type: GeoprocessingServiceType;
```

***

### uri?

```ts
optional uri: string;
```

***

### workers?

```ts
optional workers: string[];
```

Names of worker functions used by this function.  Must be sync geoprocessing functions

#### Inherited from

[`GeoprocessingHandlerOptions`](GeoprocessingHandlerOptions.md).[`workers`](GeoprocessingHandlerOptions.md#workers)

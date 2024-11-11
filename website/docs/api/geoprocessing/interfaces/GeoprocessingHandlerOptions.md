# GeoprocessingHandlerOptions

## Extended by

- [`GeoprocessingServiceMetadata`](GeoprocessingServiceMetadata.md)

## Properties

### description

```ts
description: string;
```

Appears in service metadata

***

### executionMode

```ts
executionMode: ExecutionMode;
```

Choose `sync` for functions that are expected to return quickly (< 2s)
and `async` for longer running functions, especially contain/docker jobs.

***

### issAllowList?

```ts
optional issAllowList: string[];
```

List domains, e.g. myproject.seasketch.org.
When restrictedAccess is enabled, this function can be configured to only
work with specified projects.

***

### memory?

```ts
optional memory: number;
```

Megabytes, 128 - 3008

***

### rateLimit?

```ts
optional rateLimit: number;
```

***

### rateLimited?

```ts
optional rateLimited: boolean;
```

Whether to rate limit beyond basic DDoS protection

***

### rateLimitPeriod?

```ts
optional rateLimitPeriod: RateLimitPeriod;
```

`daily` or `monthly`

***

### requiresProperties?

```ts
optional requiresProperties: string[];
```

Specify the ids of any Sketch Class form fields that must be provided in
order to run the function

***

### restrictedAccess?

```ts
optional restrictedAccess: boolean;
```

Whether function should respect group access-control headers

***

### timeout

```ts
timeout: number;
```

Seconds

***

### title

```ts
title: string;
```

Title will appear in service metadata and be referenced by clients

***

### workers?

```ts
optional workers: string[];
```

Names of worker functions used by this function.  Must be sync geoprocessing functions

# VectorDataSourceOptions

## Properties

### cacheSize

```ts
cacheSize: number;
```

Max number of feature bundles to keep in memory.
Calls to .fetch() will not return more than the contents these bundles, so
this acts as an effective limit on subsequent analysis.

#### Default

```ts
250
```

#### Memberof

VectorDataSourceOptions

***

### dissolvedFeatureCacheExcessLimit

```ts
dissolvedFeatureCacheExcessLimit: number;
```

When features are requested by fetch, bundled features with matching
union_id will be dissolved into a single feature. This dissolved feature is
expensive to create and so may be cached. A cache may contain more bundles
than needed, and this variable sets a cap on that number.

#### Default

```ts
3
```

#### Memberof

VectorDataSourceOptions

***

### hintPrefetchLimit

```ts
hintPrefetchLimit: number;
```

Source will only preload bundles when the bounding box provided to hint()
contains less than hintPrefetchLimit bundles.

#### Default

```ts
8
```

#### Memberof

VectorDataSourceOptions

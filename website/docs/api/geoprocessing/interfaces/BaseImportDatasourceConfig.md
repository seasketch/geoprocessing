# BaseImportDatasourceConfig

## Properties

### dstPath

```ts
dstPath: string;
```

Path to store imported datasets after transformation, ready to be published or accessed via local web server for tests

---

### gp

```ts
gp: object;
```

geoprocessing metadata

#### author

```ts
author: string;
```

#### clients

```ts
clients: object[];
```

#### geoprocessingFunctions

```ts
geoprocessingFunctions: string[];
```

#### organization?

```ts
optional organization: string;
```

#### preprocessingFunctions

```ts
preprocessingFunctions: string[];
```

#### region

```ts
region: string;
```

---

### package

```ts
package: object;
```

project package metadata

#### author

```ts
author: string;
```

#### bugs?

```ts
optional bugs: Record<string, string>;
```

#### dependencies?

```ts
optional dependencies: Record<string, string>;
```

#### description

```ts
description: string;
```

#### devDependencies?

```ts
optional devDependencies: Record<string, string>;
```

#### homepage?

```ts
optional homepage: string;
```

#### keywords?

```ts
optional keywords: string[];
```

#### license

```ts
license: string;
```

#### name

```ts
name: string;
```

#### private?

```ts
optional private: boolean;
```

#### repository?

```ts
optional repository: Record<string, string>;
```

#### repositoryUrl?

```ts
optional repositoryUrl: string;
```

#### scripts?

```ts
optional scripts: Record<string, string>;
```

#### type?

```ts
optional type: string;
```

#### version

```ts
version: string;
```

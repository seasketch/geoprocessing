# Preprocessing

## genPreprocessor

[genPreprocessor](./api/geoprocessing/functions/genPreprocessor.md) is a quick method for creating a preprocessing function when you only need to perform one or more clip operations on your sketch (intersection or difference).

Offers useful checks that can be enabled such as `ensurePolygon`, `maxSize`, and `enforceMaxSize`.

Clip operations must be done against published datasources defined in datasources.json.

- Example - [clipToOceanEez](https://github.com/seasketch/geoprocessing/blob/dev/packages/template-ocean-eez/src/functions/clipToOceanEez.ts)
- Example - [clipToLand](https://github.com/seasketch/geoprocessing/blob/dev/packages/template-ocean-eez/src/functions/clipToLand.ts)

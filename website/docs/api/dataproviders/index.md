# dataproviders

## Index

### Functions

| Function | Description |
| ------ | ------ |
| [fgbFetchAll](functions/fgbFetchAll.md) | Fetch features within bounding box and deserializes them, awaiting all of them before returning. Useful when running a spatial function on the whole set. |
| [fgBoundingBox](functions/fgBoundingBox.md) | - |
| [genClipLoader](functions/genClipLoader.md) | Given a project client and 1 or more clip operations, returns a function that when called loads clip features from their datasources that overlap with the feature polygon to clip. Pass this function to genPreprocessor() and it will take care of the rest. |
| [getFeatures](functions/getFeatures.md) | Returns features for a variety of vector datasources and formats, with additional filter options |
| [loadCog](functions/loadCog.md) | Returns cog-aware georaster at given url. Will not fetch raster values until subsequent geoblaze calls are made with a geometry and it will calculate the window to load based on the geometry. The subsequent geoblaze calls (e.g. sum) must be called async to allow the raster to load. |
| [loadCogWindow](functions/loadCogWindow.md) | Returns georaster window (image subset) defined by options.windowBox, otherwise loads the whole raster windowBox is extended out to the nearest pixel edge to (in theory) avoid resampling. Assumes raster is in WGS84 degrees This function front loads the raster values, so subsequent geoblaze calls (e.g. sum) can be called sync |
| [loadFgb](functions/loadFgb.md) | Fetch features within bounding box and deserializes them, awaiting all of them before returning. Useful when running a spatial function on the whole set. |

# geoprocessing

`geoprocessing` is the main module used by a geoprocessing project.  It includes everything needing for creating, building, testing, and deploying a geoprocessing project with the exception of UI components which are exported separately in `client-ui`.

## Index

### Classes

| Class | Description |
| ------ | ------ |
| [ComplexityError](classes/ComplexityError.md) | Error signifying function threw due to not being able to handle the input - e.g. size/complexity |
| [GeoprocessingHandler](classes/GeoprocessingHandler.md) | Manages the task of executing a geoprocessing function within an AWS Lambda function. This includes sending estimate of completion, caching the results, and getting them back to the client. Supports 2 different execution modes for running a geoprocessing function - sync and async These modes create 3 different request scenarios. A lambda is created for each scenario, and they all run this one handler. 1 - sync executionMode - immediately run gp function and return result in resolved promise to client 2 - async executionMode, ASYNC_REQUEST_TYPE=start - invoke a second lambda to run gp function and return incomplete task to client with socket for notification of result 3 - async executionMode, ASYNC_REQUEST_TYPE=run - run gp function started by scenario 2 and send completed task info on socket for client to pick up result |
| [PreprocessingHandler](classes/PreprocessingHandler.md) | Lambda handler for a preprocessing function |
| [ProjectClientBase](classes/ProjectClientBase.md) | Client for reading project configuration/metadata. |
| [ValidationError](classes/ValidationError.md) | Error signifying input is not valid |
| [VectorDataSource](classes/VectorDataSource.md) | - |

### Interfaces

| Interface | Description |
| ------ | ------ |
| [BaseImportDatasourceConfig](interfaces/BaseImportDatasourceConfig.md) | - |
| [CalcStatsOptions](interfaces/CalcStatsOptions.md) | options accepted by geoblaze.stats() to calc-stats library See https://github.com/DanielJDufour/calc-stats/tree/main?tab=readme-ov-file#advanced-usage |
| [ClipOptions](interfaces/ClipOptions.md) | Optional parameters for preprocessor function |
| [DatasourceClipOperation](interfaces/DatasourceClipOperation.md) | Parameters for clip operation using a datasource |
| [DatasourceOptions](interfaces/DatasourceOptions.md) | - |
| [DefaultExtraParams](interfaces/DefaultExtraParams.md) | Common set of extra parameters that might be passed to a geoprocessing function Replace or extend these as needed, there is nothing special about the param names other than to be descriptive of what they represent. |
| [Feature](interfaces/Feature.md) | A feature object which contains a geometry and associated properties. https://tools.ietf.org/html/rfc7946#section-3.2 |
| [FeatureClipOperation](interfaces/FeatureClipOperation.md) | Parameters for clip operation using polygon features |
| [FeatureCollection](interfaces/FeatureCollection.md) | A collection of feature objects. https://tools.ietf.org/html/rfc7946#section-3.3 |
| [FeatureMap](interfaces/FeatureMap.md) | A simple map of features keyed by their name |
| [FeatureTree](interfaces/FeatureTree.md) | - |
| [GeogProp](interfaces/GeogProp.md) | - |
| [GeometryCollection](interfaces/GeometryCollection.md) | Geometry Collection https://tools.ietf.org/html/rfc7946#section-3.1.8 |
| [GeoprocessingHandlerOptions](interfaces/GeoprocessingHandlerOptions.md) | - |
| [GeoprocessingProject](interfaces/GeoprocessingProject.md) | - |
| [GeoprocessingRequestModel](interfaces/GeoprocessingRequestModel.md) | Geoprocessing request internal data model, with full objects, no JSON strings |
| [GeoprocessingServiceMetadata](interfaces/GeoprocessingServiceMetadata.md) | Expected public service metadata for each function |
| [GeoprocessingTask](interfaces/GeoprocessingTask.md) | - |
| [Georaster](interfaces/Georaster.md) | - |
| [Histogram](interfaces/Histogram.md) | - |
| [HistogramOptions](interfaces/HistogramOptions.md) | - |
| [IucnActivity](interfaces/IucnActivity.md) | - |
| [IucnActivityRank](interfaces/IucnActivityRank.md) | - |
| [IucnCategory](interfaces/IucnCategory.md) | - |
| [IucnCategoryCombined](interfaces/IucnCategoryCombined.md) | - |
| [LineString](interfaces/LineString.md) | LineString geometry object. https://tools.ietf.org/html/rfc7946#section-3.1.4 |
| [MetricGroupItem](interfaces/MetricGroupItem.md) | - |
| [MetricPack](interfaces/MetricPack.md) | Alternative JSON format for metrics data that is smaller in size, better suited for blob storage and network transport |
| [MultiLineString](interfaces/MultiLineString.md) | MultiLineString geometry object. https://tools.ietf.org/html/rfc7946#section-3.1.5 |
| [MultiPolygon](interfaces/MultiPolygon.md) | MultiPolygon geometry object. https://tools.ietf.org/html/rfc7946#section-3.1.7 |
| [Node](interfaces/Node.md) | - |
| [NullSketch](interfaces/NullSketch.md) | - |
| [NullSketchCollection](interfaces/NullSketchCollection.md) | - |
| [PercentEdgeOptions](interfaces/PercentEdgeOptions.md) | - |
| [Point](interfaces/Point.md) | Point geometry object. https://tools.ietf.org/html/rfc7946#section-3.1.2 |
| [Polygon](interfaces/Polygon.md) | Polygon geometry object. https://tools.ietf.org/html/rfc7946#section-3.1.6 |
| [PreprocessingHandlerOptions](interfaces/PreprocessingHandlerOptions.md) | - |
| [PreprocessingRequest](interfaces/PreprocessingRequest.md) | - |
| [PreprocessingResponse](interfaces/PreprocessingResponse.md) | - |
| [PreprocessingService](interfaces/PreprocessingService.md) | - |
| [PreprocessingServiceMetadata](interfaces/PreprocessingServiceMetadata.md) | - |
| [ProjectClientConfig](interfaces/ProjectClientConfig.md) | - |
| [ProjectClientInterface](interfaces/ProjectClientInterface.md) | - |
| [RasterStatsOptions](interfaces/RasterStatsOptions.md) | options accepted by rasterStats |
| [RbcsObjective](interfaces/RbcsObjective.md) | - |
| [RegBasedClassificationMetric](interfaces/RegBasedClassificationMetric.md) | Extended metric for mpa-reg-based-classification results, either zone or mpa classification |
| [Report](interfaces/Report.md) | Represents a single report, with one or more metrics |
| [ReportContextValue](interfaces/ReportContextValue.md) | Provides necessary context to ReportClient components, particularly for use by useFunction() and useSketchProperties() hooks |
| [ReportResult](interfaces/ReportResult.md) | Report results consist of collections of metrics for sketches |
| [ReportResultBase](interfaces/ReportResultBase.md) | Metrics for reports not associated with sketches. Used for precalculation |
| [RootTaskItem](interfaces/RootTaskItem.md) | - |
| [RoundDecimalOptions](interfaces/RoundDecimalOptions.md) | - |
| [SeaSketchReportingMessageEvent](interfaces/SeaSketchReportingMessageEvent.md) | - |
| [SeaSketchReportingToggleLanguageEvent](interfaces/SeaSketchReportingToggleLanguageEvent.md) | - |
| [SeaSketchReportingToggleLayerVisibilityEvent](interfaces/SeaSketchReportingToggleLayerVisibilityEvent.md) | - |
| [SeaSketchReportingVisibleLayersChangeEvent](interfaces/SeaSketchReportingVisibleLayersChangeEvent.md) | - |
| [Sketch](interfaces/Sketch.md) | - |
| [SketchCollection](interfaces/SketchCollection.md) | - |
| [SketchMap](interfaces/SketchMap.md) | A simple map of sketches and/or sketch collections keyed by their name |
| [StatsObject](interfaces/StatsObject.md) | - |
| [TestExampleOutput](interfaces/TestExampleOutput.md) | - |
| [VectorDataSourceDetails](interfaces/VectorDataSourceDetails.md) | - |
| [VectorDataSourceOptions](interfaces/VectorDataSourceOptions.md) | - |
| [VectorFeature](interfaces/VectorFeature.md) | A feature object which contains a geometry and associated properties. https://tools.ietf.org/html/rfc7946#section-3.2 |
| [VectorPropertyFilter](interfaces/VectorPropertyFilter.md) | Specify one or more literal values for one or more vector Feature properties |
| [WindowOptions](interfaces/WindowOptions.md) | defines the new raster image to generate as a window in the source raster image. Resolution (cell size) is determined from this |

### Enumerations

| Enumeration | Description |
| ------ | ------ |
| [GeoprocessingTaskStatus](enumerations/GeoprocessingTaskStatus.md) | - |

### Functions

| Function | Description |
| ------ | ------ |
| [anchorScore](functions/anchorScore.md) | - |
| [aquacultureScore](functions/aquacultureScore.md) | - |
| [area](functions/area.md) | Calculates the area of each sketch and collection. |
| [batchDelete](functions/batchDelete.md) | - |
| [batchDeleteTasks](functions/batchDeleteTasks.md) | Batch delete array of tasks |
| [bboxOverlap](functions/bboxOverlap.md) | Returns whether bounding box A overlaps with or touches bounding box B |
| [booleanOverlap](functions/booleanOverlap.md) | Returns all B items that overlap with a A items Not all Feature types are supported, see typedoc A and B must have the same geometry dimension (single or multi). Builds on @turf/boolean-overlap. |
| [byteSize](functions/byteSize.md) | Get length of string in bytes |
| [capitalize](functions/capitalize.md) | Capitalizes the first letter of string |
| [chunk](functions/chunk.md) | Splits an array into chunks of size |
| [classIdMapping](functions/classIdMapping.md) | Returns mapping of class ID to class DataClass objects |
| [classifyMPA](functions/classifyMPA.md) | Given zone scores, returns object containing final scores, and mpa classification |
| [classifyZone](functions/classifyZone.md) | Given activity scores, returns zone number |
| [cleanCoords](functions/cleanCoords.md) | Cleans geojson coordinates to be within the bounds of the world [-90, -180, 90, 180], so that they don't wrap off the end, and can be split |
| [clip](functions/clip.md) | Performs clip operation on features |
| [clipMultiMerge](functions/clipMultiMerge.md) | Performs clip by merging features2 coords into a single multipolygon. Useful when you need features2 to be seen as a single unit when clipping feature1 (e.g. intersection) |
| [clipToPolygonFeatures](functions/clipToPolygonFeatures.md) | Takes a Polygon feature and returns the portion remaining after performing clipOperations If results in multiple polygons then returns the largest |
| [collectionHasGeometry](functions/collectionHasGeometry.md) | - |
| [createMetric](functions/createMetric.md) | Creates a new metric. Defaults to ID values of null and then copies in passed metric properties |
| [createMetrics](functions/createMetrics.md) | Creates fully defined metrics from partial. Metric values not provided are initialized to null |
| [featureToSketch](functions/featureToSketch.md) | Converts Feature to Sketch with reasonable defaults given for sketch properties if not provided |
| [featureToSketchCollection](functions/featureToSketchCollection.md) | Converts FeatureCollection to SketchCollection with reasonable defaults given for sketch properties if not provided |
| [fetchGeoJSON](functions/fetchGeoJSON.md) | Given geoprocessing function request, fetches the GeoJSON, which can also be sketch JSON |
| [findAndUpdateMetricValue](functions/findAndUpdateMetricValue.md) | Returns new sketchMetrics array with first sketchMetric matched set with new value. If no match, returns copy of sketchMetrics. Does not mutate array in place. |
| [firstMatching](functions/firstMatching.md) | Returns the first item that returns true for filter |
| [firstMatchingMetric](functions/firstMatchingMetric.md) | Returns the first metric that returns true for metricFilter |
| [flattenByGroupAllClass](functions/flattenByGroupAllClass.md) | Aggregates metrics by group |
| [flattenByGroupSketchAllClass](functions/flattenByGroupSketchAllClass.md) | Flattens group class metrics, one for each group and sketch. Each object includes the percValue for each class, and the total percValue with classes combined groupId, sketchId, class1, class2, ..., total |
| [flattenBySketchAllClass](functions/flattenBySketchAllClass.md) | Flattens class sketch metrics into array of objects, one for each sketch, where each object contains sketch id, sketch name, and all metric values for each class |
| [flattenSketchAllId](functions/flattenSketchAllId.md) | Returns one aggregate object for every sketch ID present in metrics, with additional property for each unique value for idProperty present for sketch. Example - idProperty of 'classId', and two classes are present in metrics of 'classA', and 'classB' then each flattened object will have two extra properties per sketch, .classA and .classB, each with the first metric value for that sketch/idProperty found |
| [gearTypeScore](functions/gearTypeScore.md) | - |
| [genFeature](functions/genFeature.md) | Returns a Feature with given features geometry and properties. Reasonable defaults are given for properties not provided Default geometry is a square from 0,0 to 1,1 |
| [genFeatureCollection](functions/genFeatureCollection.md) | Given array of features, return a feature collection with given properties. Generates reasonable default values for any properties not passed in The geometry type of the returned collection will match the one passed in Properties of features are retained |
| [genPreprocessor](functions/genPreprocessor.md) | Returns a preprocessor function given clipLoader function |
| [genRandomPolygons](functions/genRandomPolygons.md) | Generates random polygons within provided bounds. numPolygons defaults to 300, max_radial_length to 0.5 Wrapper around @turf/random - https://turfjs.org/docs/#randomPolygon |
| [genSampleNullSketch](functions/genSampleNullSketch.md) | Returns a Sketch with given geometry and Geometry type, Properties are reasonable random |
| [genSampleNullSketchCollection](functions/genSampleNullSketchCollection.md) | Given feature collection, return a sketch collection with reasonable random props. The geometry type of the returned collection will match the one passed in |
| [genSampleSketch](functions/genSampleSketch.md) | Returns a Sketch with given geometry and Geometry type, Properties are reasonable random |
| [genSampleSketchCollection](functions/genSampleSketchCollection.md) | Given feature collection, return a sketch collection with reasonable random props. The geometry type of the returned collection will match the one passed in |
| [genSampleSketchCollectionFromSketches](functions/genSampleSketchCollectionFromSketches.md) | Given feature collection, return a sketch collection with reasonable random props. The geometry type of the returned collection will match the one passed in |
| [genSampleSketchContext](functions/genSampleSketchContext.md) | - |
| [genSampleUserAttributes](functions/genSampleUserAttributes.md) | - |
| [genSketch](functions/genSketch.md) | Returns a Sketch with given features geometry and properties. Reasonable defaults are given for properties not provided Default geometry is a square from 0,0 to 1,1 |
| [genSketchCollection](functions/genSketchCollection.md) | Given array of sketches, return a sketch collection with given properties. Generates reasonable default values for any properties not passed in The geometry type of the returned collection will match the one passed in Properties of sketches are retained |
| [genTaskCacheKey](functions/genTaskCacheKey.md) | Generates a cache key for a geoprocessing request, given sketch properties and optional extra parameters (must be JSON compatible object) Extra parameters are canonicalized and hashed using md5 to ensure cache key is consistent. Canonicalization ensures object keys are consistent but not arrays. If you use arrays as extraParam values, make sure the order stays the same and sort first if needed to generate a consistent cache key. |
| [genZodErrorMessage](functions/genZodErrorMessage.md) | - |
| [getArea](functions/getArea.md) | Returns area of valid cells (not nodata) overlapping with feature. If no valid cells found, returns 0. |
| [getClassificationLabel](functions/getClassificationLabel.md) | - |
| [getCogFilename](functions/getCogFilename.md) | - |
| [getDatasetBucketName](functions/getDatasetBucketName.md) | - |
| [getDatasourceById](functions/getDatasourceById.md) | find and return datasource from passed datasources |
| [getExternalRasterDatasourceById](functions/getExternalRasterDatasourceById.md) | find and return external raster datasource from passed datasources |
| [getExternalVectorDatasourceById](functions/getExternalVectorDatasourceById.md) | find and return external vector datasource from passed datasources |
| [getFirstFromParam](functions/getFirstFromParam.md) | Returns first element from param object at paramName key. Parameter can be string or array of strings |
| [getFlatGeobufFilename](functions/getFlatGeobufFilename.md) | Returns datasource filename in flatgeobuf format |
| [getFlatGeobufPath](functions/getFlatGeobufPath.md) | - |
| [getGeopackagePath](functions/getGeopackagePath.md) | - |
| [getHistogram](functions/getHistogram.md) | Returns histogram of value overlap with geometry. If no cells with a value are found within the geometry overlap, returns 0. |
| [getIndexIconPerc](functions/getIndexIconPerc.md) | Returns percent protection given index value, percent is proportion (percent) of bottom color to top color to use for icon given index value (as shown in paper) e.g. index = 5.4 means bottom icon color should take 25% of icon and top color 75% |
| [getInternalRasterDatasourceById](functions/getInternalRasterDatasourceById.md) | find and return internal datasource from passed datasources |
| [getInternalVectorDatasourceById](functions/getInternalVectorDatasourceById.md) | find and return internal vector datasource from passed datasources |
| [getIucnCategoryForActivities](functions/getIucnCategoryForActivities.md) | Given list of allowed activities in the sketch, returns the highest category allowable The lack of an activity assumes it is not allowed |
| [getIucnCategoryForSketches](functions/getIucnCategoryForSketches.md) | Return Category for each sketch keyed by sketchId |
| [getIucnCategoryNameForSketches](functions/getIucnCategoryNameForSketches.md) | Return Category name for each sketch keyed by sketchId |
| [getIucnLevelNameForSketches](functions/getIucnLevelNameForSketches.md) | Return level name for each sketch keyed by sketchId |
| [getJsonFilename](functions/getJsonFilename.md) | Returns datasource filename in geojson format |
| [getJsonPath](functions/getJsonPath.md) | - |
| [getJsonUserAttribute](functions/getJsonUserAttribute.md) | - |
| [getKeys](functions/getKeys.md) | Object.keys helper that returns strongly typed key values. Uses assertion so make sure your type covers all the keys! |
| [getMetricGroupObjectiveId](functions/getMetricGroupObjectiveId.md) | Returns the top-level objective assigned for the given MetricGroup. If a classID is also passed, returns the objective ID for that class within the metric group |
| [getMetricGroupObjectiveIds](functions/getMetricGroupObjectiveIds.md) | Returns array of all objective IDs configured for the given MetricGroup. If a class does not have an objectiveId assigned, then it gets the top-level objectiveId |
| [getMinYesCountMap](functions/getMinYesCountMap.md) | Returns an object mapping objective ID to ID of first classification that counts toward objective |
| [getMpaClassificationName](functions/getMpaClassificationName.md) | Returns protection level given MPA classification index value |
| [getObjectiveById](functions/getObjectiveById.md) | find and return objectives from passed objectives |
| [getParamStringArray](functions/getParamStringArray.md) | Validates and returns string[] parameter from extraParams. If param missing it returns an empty array |
| [getRasterBoxSpherical](functions/getRasterBoxSpherical.md) | - |
| [getRasterDatasourceById](functions/getRasterDatasourceById.md) | find and return raster datasource (internal or external) from passed datasources |
| [getSketchCollectionChildIds](functions/getSketchCollectionChildIds.md) | Given sketch collection, returns IDs of sketches in the collection |
| [getSketchFeatures](functions/getSketchFeatures.md) | Given sketch or sketch collection, returns just the individual sketch features inside. |
| [getSketchToMpaProtectionLevel](functions/getSketchToMpaProtectionLevel.md) | Returns object mapping sketch id to MPA classification given sketch for rbcsMpa or collection of sketches for rbcsMpas with rbcs activity userAttributes, and area metrics for each sketch, assumes each mpa is a single zone mpa |
| [getSum](functions/getSum.md) | Returns sum of value overlap with geometry. If no cells with a value are found within the geometry overlap, returns 0. |
| [getUserAttribute](functions/getUserAttribute.md) | UserAttributes are those filled in via the attributes form specified as part of a SketchClass. This getter function is easier to use than searching the Sketch.properties.userAttributes array, supports default values, and is easier to use with typescript. |
| [getVectorDatasourceById](functions/getVectorDatasourceById.md) | find and return vector datasource (internal or external) from passed datasources |
| [getZoneClassificationName](functions/getZoneClassificationName.md) | - |
| [groupBy](functions/groupBy.md) | Similar to lodash groupBy |
| [hasOwnProperty](functions/hasOwnProperty.md) | Type narrowing to allow property checking when object can be multiple types https://fettblog.eu/typescript-hasownproperty/ Any code inside a block guarded by a conditional call to this function will have type narrowed to X |
| [includeVirtualSketch](functions/includeVirtualSketch.md) | If sketch collection passes sketchTest, then returns new collection with mergeSketchColl sketches appended and updated bbox |
| [isExternalDatasource](functions/isExternalDatasource.md) | - |
| [isExternalRasterDatasource](functions/isExternalRasterDatasource.md) | - |
| [isExternalVectorDatasource](functions/isExternalVectorDatasource.md) | - |
| [isFeature](functions/isFeature.md) | Check if object is a Feature. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isFeatureCollection](functions/isFeatureCollection.md) | Check if object is a Feature Collection. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isGeometry](functions/isGeometry.md) | Check if object is a Feature. Any code inside a block guarded by a conditional call to this function will have type narrowed to Feature |
| [isImportRasterDatasourceConfig](functions/isImportRasterDatasourceConfig.md) | - |
| [isImportVectorDatasourceConfig](functions/isImportVectorDatasourceConfig.md) | - |
| [isinternalDatasource](functions/isinternalDatasource.md) | - |
| [isInternalRasterDatasource](functions/isInternalRasterDatasource.md) | - |
| [isInternalVectorDatasource](functions/isInternalVectorDatasource.md) | - |
| [isLineStringFeature](functions/isLineStringFeature.md) | Check if object is a Linestring. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isLineStringSketchCollection](functions/isLineStringSketchCollection.md) | - |
| [isMetric](functions/isMetric.md) | Checks if object is a Metric and returns narrowed type |
| [isMetricArray](functions/isMetricArray.md) | Checks if object is a Metric array and returns narrowed type |
| [isMetricPack](functions/isMetricPack.md) | Checks if object is a MetricPack. Any code inside a block guarded by a conditional call to this function will have type narrowed to MetricPack |
| [isMultiPolygonFeature](functions/isMultiPolygonFeature.md) | Check if object is a MultiPolygon. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isMultiPolygonSketch](functions/isMultiPolygonSketch.md) | Checks if sketch is a MultiPolygon. Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch |
| [isMultiPolygonSketchCollection](functions/isMultiPolygonSketchCollection.md) | - |
| [isNullSketch](functions/isNullSketch.md) | Checks if object is a NullSketch. Any code inside a block guarded by a conditional call to this function will have type narrowed to NullSketch |
| [isNullSketchCollection](functions/isNullSketchCollection.md) | Check if object is a NullSketchCollection. Any code inside a block guarded by a conditional call to this function will have type narrowed to NullSketchCollection |
| [isObject](functions/isObject.md) | - |
| [isPointFeature](functions/isPointFeature.md) | Check if object is a Point. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isPointSketchCollection](functions/isPointSketchCollection.md) | - |
| [isPolygonAllSketchCollection](functions/isPolygonAllSketchCollection.md) | - |
| [isPolygonAnyFeature](functions/isPolygonAnyFeature.md) | Check if object is a Polygon or MultiPolygon. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isPolygonFeature](functions/isPolygonFeature.md) | Check if object is a Polygon feature. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isPolygonFeatureArray](functions/isPolygonFeatureArray.md) | Check if object is an array of Polygon features. Any code inside a block guarded by a conditional call to this function will have type narrowed |
| [isPolygonSketch](functions/isPolygonSketch.md) | Checks if sketch is a Polygon |
| [isPolygonSketchCollection](functions/isPolygonSketchCollection.md) | - |
| [isRasterDatasource](functions/isRasterDatasource.md) | - |
| [isRbcsProtectionLevel](functions/isRbcsProtectionLevel.md) | Type guard for checking string is one of supported objective IDs Use in conditional block logic to coerce to type RbcsObjectiveKey within the block |
| [isSketch](functions/isSketch.md) | Checks if object is a Sketch. Any code inside a block guarded by a conditional call to this function will have type narrowed to Sketch |
| [isSketchCollection](functions/isSketchCollection.md) | Check if object is a SketchCollection. Any code inside a block guarded by a conditional call to this function will have type narrowed to SketchCollection |
| [isTruthyAttributeValue](functions/isTruthyAttributeValue.md) | - |
| [isVectorDatasource](functions/isVectorDatasource.md) | - |
| [keyBy](functions/keyBy.md) | Similar to lodash keyBy |
| [maxWidth](functions/maxWidth.md) | Returns the maximum width of the geojson or bbox |
| [metricsForSketch](functions/metricsForSketch.md) | Returns metrics for given sketch (can be an array of sketches) |
| [metricsSketchIds](functions/metricsSketchIds.md) | Returns metrics with matching sketchId (can be an array of sketchids) |
| [metricsWithClassId](functions/metricsWithClassId.md) | Returns metrics with matching sketchId (can be an array of sketchids) |
| [metricsWithSketchId](functions/metricsWithSketchId.md) | Returns metrics with matching sketchId (can be an array of sketchids) |
| [minWidth](functions/minWidth.md) | Returns the minimum width of the bounding box of given feature |
| [mpaClassMetric](functions/mpaClassMetric.md) | Given sketch for rbcsMpa with rbcs activity userAttributes, assumes mpa is a single zone mpa and returns metrics with mpa classification score |
| [mpaClassMetrics](functions/mpaClassMetrics.md) | Given sketch for rbcsMpa or collection of sketches for rbcsMpas with rbcs activity userAttributes, assumes each mpa is a single zone mpa and returns metrics with mpa classification score Collection metric will have mpa classification score index as value |
| [nestMetrics](functions/nestMetrics.md) | Recursively groups metrics by ID in order of ids specified to create arbitrary nested hierarchy for fast lookup. Caller responsible for all metrics having the ID properties defined If an id property is not defined on a metric, then 'undefined' will be used for the key |
| [overlapArea](functions/overlapArea.md) | Assuming sketches are within some outer boundary with size outerArea, calculates the area of each sketch and the proportion of outerArea they take up. |
| [overlapAreaGroupMetrics](functions/overlapAreaGroupMetrics.md) | Generate overlap group metrics using overlapArea operation |
| [overlapFeatures](functions/overlapFeatures.md) | Calculates overlap between sketch(es) and an array of polygon features. Supports area or sum operation (given sumProperty), defaults to area If sketch collection includes overall and per sketch |
| [overlapFeaturesGroupMetrics](functions/overlapFeaturesGroupMetrics.md) | Generate overlap group metrics using overlapFeatures operation |
| [overlapGroupMetrics](functions/overlapGroupMetrics.md) | Given area overlap metrics stratified by class and sketch, returns new metrics also stratified by group Assumes a sketch is member of only one group, determined by caller-provided metricToGroup For each group+class, calculates area of overlap between sketches in group and featuresByClass (with overlap between group sketches removed first) Types of metrics returned: sketch metrics: copy of caller-provided sketch metrics with addition of group ID overall metric for each group+class: takes sketches in group, subtracts overlap between them and overlap with higher group sketches, and runs operation If a group has no sketches in it, then no group metrics will be included for that group, and group+class metric will be 0 |
| [overlapRaster](functions/overlapRaster.md) | Returns metrics representing sketch overlap with raster. If sketch collection, then calculate overlap for all child sketches also |
| [overlapRasterClass](functions/overlapRasterClass.md) | Calculates sum of overlap between sketches and a categorical raster with numeric values representing feature classes If sketch collection, then calculate overlap for all child sketches also |
| [overlapRasterGroupMetrics](functions/overlapRasterGroupMetrics.md) | Generate overlap group metrics using rasterMetrics operation |
| [overlapSubarea](functions/overlapSubarea.md) | Returns area stats for sketch input after performing overlay operation against a subarea feature. Includes both area overlap and percent area overlap metrics, because calculating percent later would be too complicated For sketch collections, dissolve is used when calculating total sketch area to prevent double counting |
| [packMetrics](functions/packMetrics.md) | Converts Metric array to a new MetricPack. Assumes metric dimensions are consistent for each element in the array, and null values are used |
| [parseGeoraster](functions/parseGeoraster.md) | - |
| [parseLambdaResponse](functions/parseLambdaResponse.md) | Parses result from worker lambda |
| [percentGoalWithEdge](functions/percentGoalWithEdge.md) | Special percent formatter designed to produce readable percent values for display given an upper percent goal All parameters are expected to be decimal percent values e.g. .001 = 1/10th of a percent. |
| [percentWithEdge](functions/percentWithEdge.md) | Special percent formatter designed to produce readable percent values for display with special handling of numbers within some edge range of user-defined lower or upper bounds. Defaults to handle only lower edge with lowerBound = 0 and lower = .001. All bound values are expected to be in decimal percent. So 1/10th of a percent is .001 |
| [randomFloat](functions/randomFloat.md) | - |
| [randomInt](functions/randomInt.md) | - |
| [rasterMetrics](functions/rasterMetrics.md) | Calculates stats on the provided raster and returns as an array of Metric objects (defaults to sum stat) If sketch, then calculate overlap metrics, sketch collection will calculate metrics for each individual sketch within |
| [rasterStats](functions/rasterStats.md) | Calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature. Defaults to calculating only sum stat If no cells found, returns 0 or null value for each stat as appropriate. |
| [rasterStatsToMetrics](functions/rasterStatsToMetrics.md) | Converts an array of geoblaze raster StatsObjects to an array of Metrics |
| [rbcsMpaToMetric](functions/rbcsMpaToMetric.md) | - |
| [rbcsZoneToMetric](functions/rbcsZoneToMetric.md) | Transforms an rbcs zone object to a metric |
| [rekeyMetrics](functions/rekeyMetrics.md) | Reorders metrics (by mutation) to a consistent key order for readability |
| [rekeyObject](functions/rekeyObject.md) | Reorders object, mutating in place, in the order provided |
| [removeSketchCollPolygonHoles](functions/removeSketchCollPolygonHoles.md) | - |
| [removeSketchPolygonHoles](functions/removeSketchPolygonHoles.md) | - |
| [roundDecimal](functions/roundDecimal.md) | Rounds a number to a fixed precision |
| [roundLower](functions/roundLower.md) | Formats number to string, rounding decimal to number of digits, with special handling of minimum bound |
| [runLambdaWorker](functions/runLambdaWorker.md) | Runs a function on a specified lambda worker |
| [sampleSketchReportContextValue](functions/sampleSketchReportContextValue.md) | Creates a ReportContextValue object for a Sketch with sample values. overrides will be merged in, replacing default values |
| [scanTasks](functions/scanTasks.md) | - |
| [sketchToId](functions/sketchToId.md) | Given sketch(es), returns ID(s) |
| [sketchToZone](functions/sketchToZone.md) | - |
| [sortMetrics](functions/sortMetrics.md) | Sorts metrics to a consistent order for readability Defaults to [metricId, classId, sketchId] |
| [sortMetricsDisplayOrder](functions/sortMetricsDisplayOrder.md) | Sorts metrics by ID given a user-defined metric dimension (sortId) and array of ID values in the order they should be sorted Useful for applying a "display order" to metrics Example - sortId = classId, displayOrder = ['sand','gravel','coral'] |
| [splitFeatureAntimeridian](functions/splitFeatureAntimeridian.md) | Splits a Feature or FeatureCollection on the 180 degree antimeridian |
| [splitSketchAntimeridian](functions/splitSketchAntimeridian.md) | Splits a Sketch or SketchCollection on the 180 degree antimeridian |
| [squareMeterToKilometer](functions/squareMeterToKilometer.md) | - |
| [squareMeterToMile](functions/squareMeterToMile.md) | - |
| [testWithinPerc](functions/testWithinPerc.md) | Expects that testValue is equal to expectedValue or optionally within percentage (defaults to .01 or 1%) |
| [toFeatureArray](functions/toFeatureArray.md) | Helper to convert a Feature or a FeatureCollection to a Feature array |
| [toFeaturePolygonArray](functions/toFeaturePolygonArray.md) | - |
| [toNullSketch](functions/toNullSketch.md) | Returns sketch or sketch collection with null geometry |
| [toNullSketchArray](functions/toNullSketchArray.md) | Helper to convert a NullSketch or NullSketchCollection to a NullSketch array |
| [toPercentMetric](functions/toPercentMetric.md) | Matches numerator metrics with denominator metrics and divides their value, returning a new array of percent metrics. If denominator metric has value of 0, returns NaN Matches on the optional idProperty given, otherwise defaulting to classId Deep copies and maintains all other properties from the numerator metric |
| [toRasterProjection](functions/toRasterProjection.md) | Reprojects a feature to the same projection as the raster. |
| [toShortSketches](functions/toShortSketches.md) | Returns an array of shorthand sketches (id + name) given a Sketch or SketchCollection. Includes a shorthand of parent collection also |
| [toSketchArray](functions/toSketchArray.md) | Helper to convert a Sketch or SketchCollection to a Sketch array, maintaining geometry type |
| [unpackMetrics](functions/unpackMetrics.md) | Converts MetricPack to a new Metric array. |
| [updateCommandsSync](functions/updateCommandsSync.md) | Run dynamodb update commands synchronously to avoid throttling, retrying on ThroughputError |
| [valueFormatter](functions/valueFormatter.md) | Given a number or string value and the name of a formatter function, returns a formatted value |
| [zeroPolygon](functions/zeroPolygon.md) | Returns a zero polygon geometry (three [0,0] coordinates) |
| [zeroSketch](functions/zeroSketch.md) | Given sketch, returns the mutated sketch with a zero polygon geometry (three [0,0] coordinates) |
| [zeroSketchArray](functions/zeroSketchArray.md) | Given sketch array, returns the mutated sketches with a zero polygon geometry (three [0,0] coordinates) |
| [zeroSketchCollection](functions/zeroSketchCollection.md) | Given sketch collection, returns the mutated collection with all child sketches switched to have zero polygon geometry (three [0,0] coordinates) |
| [zoneClassMetrics](functions/zoneClassMetrics.md) | Given sketch for rbcsZone or collection of zone sketches with userAttributes for rcbs activities, returns metrics with zone classification score as value. If sketch collection, collection metric will have mpa classification score index as value |

### Type Aliases

| Type alias | Description |
| ------ | ------ |
| [bandArithmetic](type-aliases/bandArithmetic.md) | - |
| [BaseDatasource](type-aliases/BaseDatasource.md) | - |
| [BBox](type-aliases/BBox.md) | Bounding box https://tools.ietf.org/html/rfc7946#section-5 |
| [ClassificationId](type-aliases/ClassificationId.md) | Unique string ID for classification given to sketches (e.g. zone classification, protection level) |
| [ClassStats](type-aliases/ClassStats.md) | - |
| [ClientJsonConfig](type-aliases/ClientJsonConfig.md) | Represents a geoprocessing client object |
| [ClipOperations](type-aliases/ClipOperations.md) | Supported clip operations |
| [DataClass](type-aliases/DataClass.md) | Represents a group of data classes. Used to access the data, and calcualte metrics based on them. This interface is murky but it supports a variety of scenarios: - Vector dataset with one feature class - Vector dataset with multiple feature class, each with their own file datasource, and possibly only one layerId to display them all - Vector dataset with multiple feature classes, all in one file datasource, each class with its own layerId - Raster with multiple feature classes represented by unique integer values that map to class names |
| [Datasource](type-aliases/Datasource.md) | - |
| [EezLandUnion](type-aliases/EezLandUnion.md) | - |
| [ExecutionMode](type-aliases/ExecutionMode.md) | - |
| [ExternalRasterDatasource](type-aliases/ExternalRasterDatasource.md) | - |
| [ExternalVectorDatasource](type-aliases/ExternalVectorDatasource.md) | - |
| [EXTRA\_RASTER\_STAT](type-aliases/EXTRA_RASTER_STAT.md) | - |
| [FunctionExtraParams](type-aliases/FunctionExtraParams.md) | - |
| [GEOBLAZE\_RASTER\_STAT](type-aliases/GEOBLAZE_RASTER_STAT.md) | - |
| [Geographies](type-aliases/Geographies.md) | - |
| [Geography](type-aliases/Geography.md) | - |
| [GeoJsonProperties](type-aliases/GeoJsonProperties.md) | - |
| [Geometry](type-aliases/Geometry.md) | Geometry object. https://tools.ietf.org/html/rfc7946#section-3 |
| [GeoprocessingJsonConfig](type-aliases/GeoprocessingJsonConfig.md) | Represents a single JS package |
| [GeoprocessingRequest](type-aliases/GeoprocessingRequest.md) | Geoprocessing request sent via HTTP GET, with extraParams as url-encoded JSON string |
| [GeoprocessingRequestParams](type-aliases/GeoprocessingRequestParams.md) | - |
| [GeorasterMetadata](type-aliases/GeorasterMetadata.md) | - |
| [GeoTypes](type-aliases/GeoTypes.md) | - |
| [get](type-aliases/get.md) | - |
| [GroupMetricAgg](type-aliases/GroupMetricAgg.md) | Single flattened metric with class values keyed by class name Useful for rendering table rows with the values of multiple classes for a group |
| [GroupMetricSketchAgg](type-aliases/GroupMetricSketchAgg.md) | - |
| [histogram](type-aliases/histogram.md) | - |
| [identify](type-aliases/identify.md) | - |
| [ImportRasterDatasourceConfig](type-aliases/ImportRasterDatasourceConfig.md) | - |
| [ImportRasterDatasourceOptions](type-aliases/ImportRasterDatasourceOptions.md) | - |
| [ImportVectorDatasourceConfig](type-aliases/ImportVectorDatasourceConfig.md) | Full configuration needed to import a dataset |
| [ImportVectorDatasourceOptions](type-aliases/ImportVectorDatasourceOptions.md) | - |
| [InternalRasterDatasource](type-aliases/InternalRasterDatasource.md) | - |
| [InternalVectorDatasource](type-aliases/InternalVectorDatasource.md) | - |
| [ISO8601DateTime](type-aliases/ISO8601DateTime.md) | - |
| [ISO8601Duration](type-aliases/ISO8601Duration.md) | - |
| [IucnActivityRankId](type-aliases/IucnActivityRankId.md) | - |
| [JSONValue](type-aliases/JSONValue.md) | - |
| [load](type-aliases/load.md) | - |
| [LoadedPackage](type-aliases/LoadedPackage.md) | - |
| [max](type-aliases/max.md) | - |
| [mean](type-aliases/mean.md) | - |
| [median](type-aliases/median.md) | - |
| [Metric](type-aliases/Metric.md) | Represents a single record of a metric with a value, stratified by one or more dimensions. The naming is a bit of a misnomer, you can think of it as a MetricValue |
| [MetricDimension](type-aliases/MetricDimension.md) | - |
| [MetricGroup](type-aliases/MetricGroup.md) | Represents a single metric, having one DataGroup |
| [MetricGroups](type-aliases/MetricGroups.md) | - |
| [MetricIdTypes](type-aliases/MetricIdTypes.md) | - |
| [MetricProperty](type-aliases/MetricProperty.md) | - |
| [Metrics](type-aliases/Metrics.md) | - |
| [min](type-aliases/min.md) | - |
| [mode](type-aliases/mode.md) | - |
| [MpaClassification](type-aliases/MpaClassification.md) | - |
| [Nullable](type-aliases/Nullable.md) | - |
| [Objective](type-aliases/Objective.md) | - |
| [ObjectiveAnswer](type-aliases/ObjectiveAnswer.md) | - |
| [ObjectiveAnswerMap](type-aliases/ObjectiveAnswerMap.md) | Generic type for mapping classification ID to whether it counds toward or meets an objective Specific classification systems will extend this type with short list of allowed classification IDs |
| [ObjectiveId](type-aliases/ObjectiveId.md) | Unique name of objective |
| [Objectives](type-aliases/Objectives.md) | - |
| [OsmLandFeature](type-aliases/OsmLandFeature.md) | - |
| [Package](type-aliases/Package.md) | Represents a single JS package |
| [PartialReportContextValue](type-aliases/PartialReportContextValue.md) | - |
| [Position](type-aliases/Position.md) | A Position is an array of coordinates. https://tools.ietf.org/html/rfc7946#section-3.1.1 Array should contain between two and three elements. The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values), but the current specification only allows X, Y, and (optionally) Z to be defined. |
| [Project](type-aliases/Project.md) | - |
| [rasterCalculator](type-aliases/rasterCalculator.md) | - |
| [RasterDatasource](type-aliases/RasterDatasource.md) | - |
| [RbcsMpaObjectiveAnswerMap](type-aliases/RbcsMpaObjectiveAnswerMap.md) | Mapping of RBCS MPA Classification ID to whether it counts toward or meets an objective |
| [RbcsMpaProtectionLevel](type-aliases/RbcsMpaProtectionLevel.md) | - |
| [SketchGeometryTypes](type-aliases/SketchGeometryTypes.md) | - |
| [SketchProperties](type-aliases/SketchProperties.md) | Properties of a Sketch, defines known keys as well as unknown for extensiblity |
| [stats](type-aliases/stats.md) | - |
| [Stats](type-aliases/Stats-1.md) | - |
| [sum](type-aliases/sum.md) | - |
| [SUPPORTED\_RASTER\_STAT](type-aliases/SUPPORTED_RASTER_STAT.md) | - |
| [SupportedFormats](type-aliases/SupportedFormats.md) | - |
| [TaskKey](type-aliases/TaskKey.md) | - |
| [TypedArray](type-aliases/TypedArray.md) | Typed array of data values, the basic building block of a geotiff |
| [UserAttribute](type-aliases/UserAttribute.md) | User-defined attributes with values for Sketch. Defines known keys as well as unknown for extensiblity |
| [ValueFormatter](type-aliases/ValueFormatter.md) | Options for formatting a given value. |
| [VectorDatasource](type-aliases/VectorDatasource.md) | - |
| [Zone](type-aliases/Zone.md) | - |
| [ZoneColor](type-aliases/ZoneColor.md) | - |
| [ZoneId](type-aliases/ZoneId.md) | - |
| [ZoneName](type-aliases/ZoneName.md) | - |

### Variables

| Variable | Description |
| ------ | ------ |
| [activityRanks](variables/activityRanks.md) | - |
| [baseDatasourceSchema](variables/baseDatasourceSchema.md) | - |
| [bboxSchema](variables/bboxSchema.md) | - |
| [box2dSchema](variables/box2dSchema.md) | - |
| [box3dSchema](variables/box3dSchema.md) | - |
| [classStatsSchema](variables/classStatsSchema.md) | Pre-calculated stats by key by class |
| [clientJsonConfigSchema](variables/clientJsonConfigSchema.md) | Represents a geoprocessing client object |
| [commonHeaders](variables/commonHeaders.md) | - |
| [dataClassSchema](variables/dataClassSchema.md) | Represents a single class of data. Ties it to an underlying datasource, holds attributes used for displaying in user interfaces |
| [datasourceConfig](variables/datasourceConfig.md) | - |
| [datasourceFormatDescriptions](variables/datasourceFormatDescriptions.md) | - |
| [datasourceSchema](variables/datasourceSchema.md) | - |
| [datasourcesSchema](variables/datasourcesSchema.md) | - |
| [defaultReportContext](variables/defaultReportContext.md) | - |
| [DEFAULTS](variables/DEFAULTS.md) | - |
| [defaultStatValues](variables/defaultStatValues.md) | - |
| [externalDatasourceSchema](variables/externalDatasourceSchema.md) | Properties for external datasource |
| [externalRasterDatasourceSchema](variables/externalRasterDatasourceSchema.md) | - |
| [externalVectorDatasourceSchema](variables/externalVectorDatasourceSchema.md) | - |
| [EXTRA\_RASTER\_STATS](variables/EXTRA_RASTER_STATS.md) | Additional raster stats calculated by geoprocessing library |
| [extraParamsSchema](variables/extraParamsSchema.md) | Default set of additional parameters that a geoprocessing or preprocessing function can accept Override or extend as needed with more specific types, and use .parse() function to validate your input |
| [fcSchema](variables/fcSchema.md) | Zod schema for FeatureCollection containing polygons or multipolygons |
| [featureSchema](variables/featureSchema.md) | Zod schema for Feature containing Polygon or MultiPolygon |
| [featuresSchema](variables/featuresSchema.md) | - |
| [fixtures](variables/fixtures.md) | - |
| [fullColor](variables/fullColor.md) | - |
| [FULLY\_PROTECTED\_LEVEL](variables/FULLY_PROTECTED_LEVEL.md) | - |
| [GEOBLAZE\_RASTER\_STATS](variables/GEOBLAZE_RASTER_STATS.md) | Stats supported by geoblaze.stats() function |
| [geoblazeDefaultStatValues](variables/geoblazeDefaultStatValues.md) | - |
| [geographiesSchema](variables/geographiesSchema.md) | - |
| [geographySchema](variables/geographySchema.md) | A geographic area (Polygon) for planning. Typically used to represent a planning area |
| [geoprocessingConfigSchema](variables/geoprocessingConfigSchema.md) | Represents a single JS package |
| [geoTypesSchema](variables/geoTypesSchema.md) | - |
| [globalDatasources](variables/globalDatasources.md) | Definitive list of global datasources for geoprocessing framework @todo: fetch from global-datasources repo |
| [highColor](variables/highColor.md) | - |
| [HIGHLY\_PROTECTED\_LEVEL](variables/HIGHLY_PROTECTED_LEVEL.md) | - |
| [importRasterDatasourceOptionsSchema](variables/importRasterDatasourceOptionsSchema.md) | - |
| [importVectorDatasourceOptionsSchema](variables/importVectorDatasourceOptionsSchema.md) | - |
| [internalDatasourceSchema](variables/internalDatasourceSchema.md) | Timestamp properties to ease syncing with local/published datasource files |
| [internalImportSchema](variables/internalImportSchema.md) | Properties for importing an internal datasource |
| [internalRasterDatasourceSchema](variables/internalRasterDatasourceSchema.md) | - |
| [internalVectorDatasourceSchema](variables/internalVectorDatasourceSchema.md) | - |
| [internalVectorImportSchema](variables/internalVectorImportSchema.md) | Properties for import of internal vector datasources |
| [iucnActivities](variables/iucnActivities.md) | - |
| [iucnActivityCategories](variables/iucnActivityCategories.md) | - |
| [iucnCategoriesList](variables/iucnCategoriesList.md) | - |
| [iucnCategoriesMap](variables/iucnCategoriesMap.md) | IUCN category definitions. Note categories 2/3 and 4/6 have been merged because they have the same allowed uses |
| [iucnCategoryNames](variables/iucnCategoryNames.md) | - |
| [iucnLevels](variables/iucnLevels.md) | - |
| [jsonSchema](variables/jsonSchema.md) | - |
| [loadedPackageSchema](variables/loadedPackageSchema.md) | Stricter schema for npm package.json metadata, with most fields guaranteed present |
| [lowColor](variables/lowColor.md) | - |
| [measurementScalesSchema](variables/measurementScalesSchema.md) | - |
| [measurementTypesSchema](variables/measurementTypesSchema.md) | - |
| [MetricDimensions](variables/MetricDimensions.md) | Dimensions used in Metric |
| [metricGroupSchema](variables/metricGroupSchema.md) | Defines a metric in combination with a datasource, with one or more data classes |
| [metricGroupsSchema](variables/metricGroupsSchema.md) | - |
| [MetricProperties](variables/MetricProperties.md) | Properties used in Metric |
| [metricSchema](variables/metricSchema.md) | - |
| [metricsSchema](variables/metricsSchema.md) | - |
| [MODERATELY\_PROTECTED\_LEVEL](variables/MODERATELY_PROTECTED_LEVEL.md) | - |
| [multipolygonSchema](variables/multipolygonSchema.md) | - |
| [OBJECTIVE\_GREEN](variables/OBJECTIVE_GREEN.md) | - |
| [OBJECTIVE\_MAYBE](variables/OBJECTIVE_MAYBE.md) | - |
| [OBJECTIVE\_NO](variables/OBJECTIVE_NO.md) | - |
| [OBJECTIVE\_RED](variables/OBJECTIVE_RED.md) | - |
| [OBJECTIVE\_YELLOW](variables/OBJECTIVE_YELLOW.md) | - |
| [OBJECTIVE\_YES](variables/OBJECTIVE_YES.md) | - |
| [objectiveAnswerMapSchema](variables/objectiveAnswerMapSchema.md) | - |
| [objectiveAnswerSchema](variables/objectiveAnswerSchema.md) | - |
| [objectiveCountsAnswers](variables/objectiveCountsAnswers.md) | Readonly list of possible answers for whether sketch counts toward objective |
| [objectiveCountsColorMap](variables/objectiveCountsColorMap.md) | Object mapping answers for whether sketch counts toward objective to stop light colors - green / yellow / red |
| [objectiveSchema](variables/objectiveSchema.md) | Base planning objective, extend as needed for specific classification system or ad-hoc |
| [objectivesSchema](variables/objectivesSchema.md) | - |
| [packageSchema](variables/packageSchema.md) | Schema for npm package.json metadata, as found in the wild |
| [PLANNING\_AREA\_TYPES](variables/PLANNING_AREA_TYPES.md) | - |
| [planningAreaTypesSchema](variables/planningAreaTypesSchema.md) | - |
| [polygonSchema](variables/polygonSchema.md) | - |
| [POORLY\_PROTECTED\_LEVEL](variables/POORLY_PROTECTED_LEVEL.md) | - |
| [projectSchema](variables/projectSchema.md) | - |
| [rasterDatasourceSchema](variables/rasterDatasourceSchema.md) | Properties for raster datasource |
| [rbcsAnchoringActivities](variables/rbcsAnchoringActivities.md) | - |
| [rbcsAquacultureActivities](variables/rbcsAquacultureActivities.md) | - |
| [rbcsConstants](variables/rbcsConstants.md) | - |
| [rbcsGearTypes](variables/rbcsGearTypes.md) | - |
| [rbcsMpaProtectionLevels](variables/rbcsMpaProtectionLevels.md) | - |
| [rbcsScores](variables/rbcsScores.md) | - |
| [ReportContext](variables/ReportContext.md) | - |
| [seaSketchReportingLanguageChangeEvent](variables/seaSketchReportingLanguageChangeEvent.md) | - |
| [seaSketchReportingMessageEventType](variables/seaSketchReportingMessageEventType.md) | - |
| [seaSketchReportingVisibleLayersChangeEvent](variables/seaSketchReportingVisibleLayersChangeEvent.md) | - |
| [statsSchema](variables/statsSchema.md) | - |
| [SUPPORTED\_RASTER\_STATS](variables/SUPPORTED_RASTER_STATS.md) | Combined raster stats supported by geoprocessing library |
| [supportedFormatsSchema](variables/supportedFormatsSchema.md) | - |
| [UNPROTECTED\_LEVEL](variables/UNPROTECTED_LEVEL.md) | - |
| [vectorDatasourceSchema](variables/vectorDatasourceSchema.md) | Properties for vector datasource |
| [version](variables/version.md) | - |

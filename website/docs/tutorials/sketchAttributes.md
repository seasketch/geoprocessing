# Custom Sketch Attributes

Sketch attributes are additional properties provided with a Sketch Feature or a Sketch Collection. They can be user-defined at draw time or by the SeaSketch platform itself. The SeaSketch admin tool lets you add custom attributes to your [sketch classes](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes). SeaSketch will pass these sketch attributes on to both preprocessing and geoprocessing functions.

Common use cases:

- Preprocessor
  - Passing an extra yes/no attribute for whether to include existing protected areas as part of your sketch, or whether to allow the sketch to extend beyond the EEZ, or to include land.
  - Passing a numeric value to be used with a buffer.
- Geoprocessor
  - Provide language translations for each sketch attribute name and description, for each language enabled for the project.
  - Assign a protection level or type to an area, such that the function (and resulting report) can assess against the required amount of protection for each level.
  - Assign activities to an area, that the function can assign a protection level. This is particularly useful when reporting on an entire SketchCollection. The function can group results by protection level and ensure that overlap is not double counted within each group, but allow overlap between groups to go to the higher protection level.

## Accessing sketch properties from report client

The main way to access sketch attributes from a browser client is the [useSketchProperties()](https://seasketch.github.io/geoprocessing/api/modules/client_ui.html#useSketchProperties) hook. Examples include:

- [SketchAttributesCard](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesCard.tsx) and [story](https://seasketch.github.io/geoprocessing/storybook/?path=/story/components-card-sketchattributescard--next) with [source](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesNextCard.stories.tsx)

## Accessing sketch properties from function

Withing a preprocessing or geoprocessing function, the [SketchProperties](https://seasketch.github.io/geoprocessing/api/modules/geoprocessing.html#SketchProperties) are provided within every sketch. Within that are [userAttributes](https://seasketch.github.io/geoprocessing/api/modules/geoprocessing.html#UserAttribute) that contain all of the user-defined attributes.

For example, assume your Polygon sketch class contains an attribute called `ACTIVITIES` which is an array of allowed activities for this sketch class. And you have a second attribute called `ISLAND` that is a string containing the name of the island this sketch is located. You can access it as follow:

```javascript
export async function protection(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const sketches = toSketchArray(sketch);
  // Complex attributes are JSON that need to be parsed
  const activities = getJsonUserAttribute(sketches[0], 'ACTIVITIES')
  // Simple attributes are simple strings or numbers that can be used directly
  const island = getUserAttribute(sketches[0], 'ISLAND')
```

Examples of working with user attributes:

- [getIucnCategoryForSketches](https://github.com/seasketch/geoprocessing/blob/1301dc787aeff59ed29ceb07ed2d925984da6abf/packages/geoprocessing/src/iucn/helpers.ts#L36) takes an array of sketches, extracts the list of IUCN `ACTIVITIES` the sketch designated as allowed for each sketch, and returns the category (protection level) for each sketch. The sketch array can be generated from the `sketch` parameter passed to a geoprocessing functions using [toSketchArray()`](https://github.com/seasketch/geoprocessing/blob/1301dc787aeff59ed29ceb07ed2d925984da6abf/packages/geoprocessing/src/helpers/sketch.ts#L83). toSketchArray helps you write single functions that work on either a single sketch or a collection of sketches.
- [isContiguous](https://github.com/seasketch/fsm-reports/blob/main/src/functions/boundaryAreaOverlap.ts#L26) function that optionally merges the contiguous zone with the users sketch. Checks for existence of a [specific user attribute](https://github.com/seasketch/fsm-reports/blob/main/src/util/includeContiguousSketch.ts#L28)

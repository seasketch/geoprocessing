# Custom Sketch Attributes

Sketch attributes are additional properties provided with a Sketch Feature or a Sketch Collection. They can be user-defined at draw time or by the SeaSketch platform itself. The SeaSketch admin tool lets you add custom attributes to your [sketch classes](https://docs.seasketch.org/seasketch-documentation/administrators-guide/sketch-classes). SeaSketch will pass these sketch attributes on to geoprocessing functions.

Potential use cases:

- Geoprocessor
  - assign a protection level or type to an area, such that the geoprocessing function (and resulting report) can assess against the required amount of protection for each level.
  - Assign allowed activities to an area, that the function can assign a protection level. This is particularly useful when reporting on an entire SketchCollection. The function can group results by protection level and ensure that overlap is not double counted within each group, and allow overlap between groups to go to the higher protection level.
  - Passing an extra yes/no attribute for whether to include existing protected areas as part of your sketch.
  - Provide language translations for each sketch attribute name and description.

## Accessing sketch properties from report client

The main way to access sketch attributes in a browser client is the [useSketchProperties()](../api/client-ui/functions/useSketchProperties.md) hook. Examples include:

- [SketchAttributesCard](../api/client-ui/functions/SketchAttributesCard.md) and [story](https://seasketch.github.io/gp-storybook/Next/index.html?path=/story/components-card-sketchattributescard--next) with [source](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/SketchAttributesNextCard.stories.tsx)

## Accessing sketch properties from function

Withing a preprocessing or geoprocessing function, the [SketchProperties](../api/geoprocessing/type-aliases/SketchProperties.md) are provided within every sketch. Within that are [userAttributes](../api/geoprocessing/type-aliases/UserAttribute.md) that contain all of the user-defined attributes.

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

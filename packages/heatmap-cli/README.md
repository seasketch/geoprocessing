# heatmap-js

Generate heatmaps from geojson features using H3

## Usage

Requires Node 14.0 or greater as it builds with an ES2020 target as an ESM module. If you still need CommonJS, use a dynamic import to convert it.

## Behavior

- for each geojson feature, only hex cells whose centerpoint is inside the feature will be included in the heatmap.  Every geojson feature will have at least one hexagon, so if there are no hexagons whose centerpoint overlaps, then the nearest hexagon will be included.

Supports the following aggregation methods:
- countShapes - counts the number of features overlapping with each hex cell
- sap - spatial access priority (1 / area)
- sapWeighted - spatial access priority value with importance value (importance / area)

## Questions

* should heatmap values get normalized?  Rounded off precision to save space in json file?
* quantile should be calculated based on the features or the cell ID heat values? Is frequency important?  A single polygon could be hundreds of h3 cellIds.  should a large polygon have an outsize influence on the quantile breakpoints?
* should the quantile range be the same across hex resolutions?  Why does it currently differ?
* if we want to support multiple methods (quantile, jenks), then it might be easier to output the heatmap value into the tiles, and calculate breakpoints for multiple methods into meta.json.  Then the hex cell can be assigned to a class on the client-side.  Or in a follow-on step in the script.

## Performance Improvement Potential

* After generating the highest level h3 index, tbe index for parent resolutions can be quickly generated.  However it's not clear how the heatmap should be rolled up?  Should the children for each parent be summed?  The highest child value be used?

## Debug in VSCode

buildIndex - set VSCode debug to "Auto Attach: Always", set breakpoint in code, and `npm run build-index`

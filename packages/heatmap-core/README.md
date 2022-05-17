# heatmap-core

Generate heatmaps in-memory from geojson features using H3.  Designed for use in browser or Node.

## Usage

Requires Node 14.0 or greater as it builds with an ES2020 target as an ESM module. If you still need CommonJS, use a dynamic import to convert it.

## Behavior

- for each geojson feature, only hex cells whose centerpoint is inside the feature will be included in the heatmap.  Every geojson feature will have at least one hexagon, so if there are no hexagons whose centerpoint overlaps, then the nearest hexagon will be included.

Supports the following aggregation methods:
- countShapes - counts the number of features overlapping with each hex cell
- sap - spatial access priority (1 / area)
- sapWeighted - spatial access priority value with importance value (importance / area)

## Debug in VSCode

buildIndex - set VSCode debug to "Auto Attach: Always", set breakpoint in code, and `npm run build-index`

## v0.12.0 (2020-05-12)

#### :rocket: New Feature

* Add support for project templates with 4 nascent templates included - gp-area, gp-clip-ocean, gp-clip-bbox, gp-raster-stats (https://github.com/seasketch/geoprocessing/issues/41)
* Add Node 14.x support
* Added `start:client` CLI command.  Serves the project Client bundle locally using Webpack dev server, allowing user to load and test the project reports using Message interface, just as SeaSketch platform does.

#### :bug: Bug Fix

* Resolve bug bundling gp-clip-bbox when linked geoprocessing library is used
* Resolve bug where geoprocessing library installed by init had fuzzy versioning, require exact version.
* Resolve inability to build gp-ocean-clip template due to webpack module resolution being too narrow.
* Fix missing .gitignore file in user-generated project.  Now it installs and ignores from each template are now merged in on install.
* Fix bug that caused download dropdown order issue
* Remove errant top-level monorepo dependencies
* Fix streaming false message in console output when deploying stack

#### :house: Internal

* Refactor CloudFormation stack, extracting GeoprocessingStack, renaming most resource names and Logical IDs.  ***This will be a destructive change to all deployed stacks when upgrading, previous analysis results will be lost ***
* Migrate CloudFormation stack to Node 14x Lambda runtime
* Bump all dependencies to latest (webpack 5 support held back)
* Add createProject() function to programmatically create projects.
* Add CDK stack and template snapshot tests.
* upgrade polygon-clipping with martinez 0.7n support
* Add CI github workflow
* Support full bucket delete on stack delete
* Soup up the `create_example` script to create an example with async geoprocessing function as well as sync.  Ensure it is buildable and deployable out of the box.
* Remove now unused IntersectHelper module.

#### :memo: Documentation

* Update docs on how to install templates
* Add README to geoprocessing package for people finding via NPM

## v0.11.1 (2020-03-25)

#### :bug: Bug Fix

* Migrate from CSS modules to styled-components.  The CSS files were not being copied into the build so it was an opportunity to just consolidate on using SC
* Remove duplicate Checkbox identifier.  Was only caught downstream by Webpack

## v0.11.0 (2020-03-25)

#### :rocket: New Feature

* Add Toolbar component
* Add DataDownload component with CSV/JSON support.  CSV has auto-flattening of arrays/objects using json2csv library.  Downloaded files default to including report name, sketch name (if context available) and current ISO timestamp.
* Add DataDownloadToolbar convenience component
* Add data download toolbar to Table component for convenience

#### :bug: Bug Fix

* Replace useDropdown with Dropdown component based on popper.js and usePopper hook
* Fix bug with Jest not being able to interpret CSS module imports, they are now stubbed.

## v0.10.0 (2020-03-19)

#### :rocket: New Feature

* Add new `Table` component
* Add new `FilterSelectTable` component, built on new `CheckboxGroup`
* Add geoprocessing function helpers - isPolygon, martinez, toJson
* Add sketch helpers - filterByBbox, getExampleSketchesByName

#### :bug: Bug Fix

* Add explicit jest dependency, was causing test failure with fresh install and latest npm
* Drop errant geoprocessing dependency from root
* Change lerna to use `npm ci` on publish so that prepublish steps don't produce local lockfile changes which stop the subsequent publish

#### :house: Internal

* Add `install` script, avoids user awareness of Lerna
`clean` scripts
* Add `publish:alpha` and `publish:stable` scripts, avoids user awareness of Lerna
* Switch geoprocessing build from `prepublishOnly` to `prepare` so that it's run on initial install as well
* Add `watch` and `watch:script` scripts to geoprocessing to automatically rebuild assets, useful when in active development with a linked report project
* Add complementary VSCode 'build' commands for all `build` and `watch` scripts, for those that prefer to use it.
* VSCode extensions - add vscode-map-preview recommendation
* VSCode settings - Add geojson schema support for intellisense
* Stop hiding build and node_modules directories in vscode, they are useful enough to keep easy access to.

#### :memo: Documentation

* Add extensive notes for how to `npm link` a report to a local geoprocessing package, and troubleshoot issues
* Document how to do alpha releases
* Document steps for debugging geoprocessing functions, including using toJsonFile, and geojson map preview

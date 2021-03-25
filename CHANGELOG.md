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

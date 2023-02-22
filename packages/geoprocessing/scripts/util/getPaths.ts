//// GEOPROCESSING LIBRARY PATHS ////

// Functions that return relatives paths to access assets within
// the geoprocessing library.

/**
 * If running geoprocessing CLI command from a project
 * the geoprocessing path is the top-level of dist folder (3 folders up),
 * If running tests in the geoprocessing library, then the
 * geoprocessing path is the top-levl of src folder (2 folders up)
 */
export function getGeoprocessingPath() {
  return /dist/.test(__dirname)
    ? `${__dirname}/../../..`
    : `${__dirname}/../..`;
}

/**
 * If running geoprocessing CLI command from a project or via create_example then execution is from
 * your_project/node_modules/@seasketch/geoprocessing/dist/script
 * and base project is located relative to this up at top-level of dist.
 * If running internal geoprocessing tests then point to base project
 * package
 */
export function getBaseProjectPath() {
  return /dist/.test(__dirname)
    ? `${__dirname}/../../base-project`
    : `${__dirname}/../../../base-project`;
}

export function getBaseFunctionPath() {
  return `${getBaseFunctionPath()}/src/functions`;
}

//// PROJECT PATHS ////

// Functions that return relative paths to access project assets
// Used by geoprocessing functions run from project space after initial project init

export function getProjectPath(basePath: string = ".") {
  return basePath;
}

export function getProjectFunctionPath(basePath: string = ".") {
  return getProjectPath(basePath) + "src/functions";
}

export function getProjectConfigPath(basePath: string = ".") {
  return getProjectPath(basePath) + "project";
}

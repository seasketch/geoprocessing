//// GEOPROCESSING LIBRARY PATHS ////

// Functions that return relatives paths to access assets within
// the geoprocessing library.

/**
 * If running geoprocessing command from your project
 * the geoprocessing path is the top-level of dist folder (3 folders up),
 * If running tests in the geoprocessing library, then the
 * geoprocessing path is the top-levl of src folder (2 folders up)
 */
export function getGeoprocessingPath() {
  const gpPath = /dist/.test(__dirname)
    ? `${__dirname}/../../..`
    : `${__dirname}/../..`;
  return gpPath;
}

/** Returns path to project template */
export function getTemplateProjectPath() {
  return `${getGeoprocessingPath()}/templates/project`;
}

/** Returns path to datasource template files */
export function getTemplateDatasourcePath() {
  return `${getGeoprocessingPath()}/templates/datasources`;
}

export function getTemplateFunctionPath() {
  return `${getGeoprocessingPath()}/templates/functions`;
}

/** Returns path to default project client and config */
export function getDefaultProjectConfigPath() {
  return `${getGeoprocessingPath()}/defaultProjectConfig/project`;
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

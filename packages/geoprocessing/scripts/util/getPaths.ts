//// GEOPROCESSING LIBRARY PATHS ////

// Functions that return relatives paths to access assets within
// the geoprocessing library.

/**
 * If running geoprocessing CLI command from a project
 * the geoprocessing path is the top-level of dist folder (3 folders up),
 * If running tests ian the geoprocessing library, then the
 * geoprocessing path is the top-levl of src folder (2 folders up)
 */
export function getGeoprocessingPath() {
  return /dist/.test(import.meta.dirname)
    ? `${import.meta.dirname}/../../..`
    : `${import.meta.dirname}/../..`;
}

/**
 * If running geoprocessing CLI command from a project then execution is from
 * your_project/node_modules/@seasketch/geoprocessing/dist/script
 * and base project is located relative to this up at top-level of dist.
 * If running internal geoprocessing tests then point to base project
 * package
 */
export function getBaseProjectPath() {
  return /dist/.test(import.meta.dirname)
    ? `${import.meta.dirname}/../../base-project`
    : `${import.meta.dirname}/../../../base-project`;
}

export function getBaseFunctionPath() {
  return `${getBaseProjectPath()}/src/functions`;
}

//// TEMPLATE PATHS ////

export function getBlankProjectPath() {
  return /dist/.test(import.meta.dirname)
    ? `${import.meta.dirname}/../../templates/starter-templates/template-blank-project`
    : `${import.meta.dirname}/../../../templates/starter-templates/template-blank-project`;
}

export function getBlankFunctionPath() {
  return `${getBlankProjectPath()}/src/functions`;
}

export function getBlankClientPath() {
  return `${getBlankProjectPath()}/src/clients`;
}

export function getBlankComponentPath() {
  return `${getBlankProjectPath()}/src/components`;
}

export function getOceanEEZProjectPath() {
  return /dist/.test(import.meta.dirname)
    ? `${import.meta.dirname}/../../templates/starter-templates/template-ocean-eez`
    : `${import.meta.dirname}/../../../templates/starter-templates/template-ocean-eez`;
}

export function getOceanEEZFunctionPath() {
  return `${getOceanEEZProjectPath()}/src/functions`;
}

export function getOceanEEZComponentPath() {
  return `${getOceanEEZProjectPath()}/src/components`;
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

export function getProjectComponentPath(basePath: string = ".") {
  return getProjectPath(basePath) + "src/components";
}

export function getProjectConfigPath(basePath: string = ".") {
  return getProjectPath(basePath) + "project";
}

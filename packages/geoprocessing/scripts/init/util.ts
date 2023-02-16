/**
 * If running from project space, which runs gp code in dist build folder
 * then set gpPath to top-level of dist folder (3 folders up), where the templates folder is
 * else must be running gp code from src folder (like tests)
 * and should set gpPath to top-level of src (2 folders up)
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

/** Returns path to default project client and config */
export function getDefaultProjectConfigPath() {
  return `${getGeoprocessingPath()}/defaultProjectConfig/project`;
}

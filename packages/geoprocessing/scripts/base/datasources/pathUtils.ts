import path from "node:path";

export function getJsonPath(dstPath: string, datasourceId: string) {
  return path.join(dstPath, datasourceId) + ".json";
}

export function getFlatGeobufPath(dstPath: string, datasourceId: string) {
  return path.join(dstPath, datasourceId) + ".fgb";
}

export function getGeopackagePath(dstPath: string, datasourceId: string) {
  return path.join(dstPath, datasourceId) + ".gpkg";
}

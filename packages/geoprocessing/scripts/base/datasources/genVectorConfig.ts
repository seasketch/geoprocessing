import path from "path";
import {
  ImportVectorDatasourceOptions,
  ImportVectorDatasourceConfig,
} from "../../../src/types";
import { datasourceConfig } from "../../../src/datasources";
import { ProjectClientBase } from "../../../src";

/** Takes import options and creates full import config */
export function genVectorConfig<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportVectorDatasourceOptions,
  newDstPath?: string
): ImportVectorDatasourceConfig {
  let {
    geo_type,
    src,
    datasourceId,
    propertiesToKeep = [],
    classKeys,
    layerName,
    formats = datasourceConfig.importDefaultVectorFormats,
    explodeMulti,
    precalc,
    propertyFilter,
    bboxFilter,
  } = options;

  if (!layerName)
    layerName = path.basename(src, "." + path.basename(src).split(".").pop());

  // merge to ensure keep at least classKeys
  propertiesToKeep = Array.from(new Set(propertiesToKeep.concat(classKeys)));

  const config: ImportVectorDatasourceConfig = {
    geo_type,
    src,
    dstPath: newDstPath || datasourceConfig.defaultDstPath,
    propertiesToKeep,
    classKeys,
    layerName,
    datasourceId,
    package: projectClient.package,
    gp: projectClient.geoprocessing,
    formats,
    explodeMulti,
    precalc,
    propertyFilter,
    bboxFilter,
  };

  return config;
}

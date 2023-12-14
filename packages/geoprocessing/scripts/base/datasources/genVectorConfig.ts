import path from "path";
import {
  ImportVectorDatasourceOptions,
  ImportVectorDatasourceConfig,
  VectorDatasource,
} from "../../../src/types";
import { datasourceConfig } from "../../../src/datasources";
import { ProjectClientBase, hasOwnProperty } from "../../../src";

/** Takes vector import options or existing datasource and creates full import config */
export function genVectorConfig<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportVectorDatasourceOptions | VectorDatasource,
  newDstPath?: string
): ImportVectorDatasourceConfig {
  const src =
    hasOwnProperty(options, "src") && typeof options.src === "string"
      ? options.src
      : "";

  // Add explodeMulti if undefined, to support ExternalVectorDatasource.  Code smell that this is added for external datasource
  const explodeMulti =
    hasOwnProperty(options, "explodeMulti") &&
    typeof options.explodeMulti === "boolean"
      ? options.explodeMulti
      : true;

  // merge to ensure keep at least classKeys
  const propertiesToKeep =
    hasOwnProperty(options, "propertiesToKeep") &&
    Array.isArray(options.propertiesToKeep)
      ? Array.from(new Set(options.propertiesToKeep.concat(options.classKeys)))
      : [];

  const config: ImportVectorDatasourceConfig = {
    ...options,
    src,
    dstPath: newDstPath || datasourceConfig.defaultDstPath,
    propertiesToKeep,
    layerName:
      options.layerName ||
      path.basename(src, "." + path.basename(src).split(".").pop()),
    package: projectClient.package,
    gp: projectClient.geoprocessing,
    explodeMulti,
  };

  return config;
}

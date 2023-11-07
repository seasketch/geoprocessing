import {
  ImportRasterDatasourceOptions,
  ImportRasterDatasourceConfig,
  RasterDatasource,
} from "../../../src/types";
import { datasourceConfig } from "../../../src/datasources";

import ProjectClientBase from "../../../src/project/ProjectClientBase";
import { hasOwnProperty } from "../../../src";

/** Takes raster import options or existing datasource and creates full import config */
export function genRasterConfig<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportRasterDatasourceOptions | RasterDatasource,
  newDstPath?: string
): ImportRasterDatasourceConfig {
  return {
    ...options,
    src:
      hasOwnProperty(options, "src") && typeof options.src === "string"
        ? options.src
        : "",
    dstPath: newDstPath || datasourceConfig.defaultDstPath,
    band: options.band || 0,
    package: projectClient.package,
    gp: projectClient.geoprocessing,
    formats: options.formats || datasourceConfig.importDefaultRasterFormats,
  };
}

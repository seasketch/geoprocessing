import {
  ImportRasterDatasourceOptions,
  ImportRasterDatasourceConfig,
  RasterDatasource,
} from "../../../src/types/index.js";
import { datasourceConfig } from "../../../src/datasources/index.js";

import ProjectClientBase from "../../../src/project/ProjectClientBase.js";
import { hasOwnProperty } from "../../../src/index.js";

/** Takes raster import options or existing datasource and creates full import config */
export function genRasterConfig<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportRasterDatasourceOptions | RasterDatasource,
  newDstPath?: string,
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
    formats: ["tif"],
  };
}

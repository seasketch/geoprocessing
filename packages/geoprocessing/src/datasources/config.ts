import { SupportedFormats } from "../types/index.js";

const vectorFormats: SupportedFormats[] = ["fgb", "json", "subdivided"];
const importSupportedVectorFormats: SupportedFormats[] = ["fgb", "json"];
const importDefaultVectorFormats: SupportedFormats[] = ["fgb"];
const importExtraVectorFormats: SupportedFormats[] = ["json"];

const rasterFormats: SupportedFormats[] = ["tif"];
const importSupportedRasterFormats: SupportedFormats[] = ["tif"];
const importDefaultRasterFormats: SupportedFormats[] = ["tif"];

const defaultDstPath = "data/dist";

/** Default datasource file location, relative to project root */
const defaultDatasourcesPath = "./project/datasources.json";

export const datasourceConfig = {
  vectorFormats,
  importSupportedVectorFormats,
  importDefaultVectorFormats,
  importExtraVectorFormats,
  rasterFormats,
  importSupportedRasterFormats,
  importDefaultRasterFormats,
  defaultDstPath,
  defaultDatasourcesPath,
};

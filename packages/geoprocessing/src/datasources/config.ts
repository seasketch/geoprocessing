import { SupportedFormats } from "../types";

const vectorFormats: SupportedFormats[] = ["fgb", "json", "subdivided"];
const importSupportedVectorFormats: SupportedFormats[] = ["fgb", "json"];
const importDefaultVectorFormats: SupportedFormats[] = ["fgb"];

const rasterFormats: SupportedFormats[] = ["tif"];
const importSupportedRasterFormats: SupportedFormats[] = ["tif"];
const importDefaultRasterFormats: SupportedFormats[] = ["tif"];

const defaultDstPath = "data/dist";
const defaultBinPath = "data/bin";

/** Default datasource file location, relative to project root */
const defaultDatasourcesPath = "./project/datasources.json";

export const datasourceConfig = {
  vectorFormats,
  importSupportedVectorFormats,
  importDefaultVectorFormats,
  rasterFormats,
  importSupportedRasterFormats,
  importDefaultRasterFormats,
  defaultDstPath,
  defaultBinPath,
  defaultDatasourcesPath,
};

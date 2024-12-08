import { SupportedFormats } from "../types/index.js";

const vectorFormats: SupportedFormats[] = ["fgb", "json", "subdivided"];
const rasterFormats: SupportedFormats[] = ["tif"];
const defaultDstPath = "data/dist";

/** Default datasource file location, relative to project root */
const defaultDatasourcesPath = "./project/datasources.json";

export const datasourceConfig = {
  vectorFormats,
  rasterFormats,
  defaultDstPath,
  defaultDatasourcesPath,
};

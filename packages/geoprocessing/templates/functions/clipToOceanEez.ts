import {
  PreprocessingHandler,
  genPreprocessor,
} from "@seasketch/geoprocessing";
import project from "../../project";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";

const clipLoader = genClipLoader(project, [
  {
    datasourceId: "global-clipping-osm-land",
    operation: "difference",
    options: {
      unionProperty: "gid",
    },
  },
  EEZ_CLIP_OPERATION,
]);

export const clipToOceanEez = genPreprocessor(clipLoader);

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description: "Example-description",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});

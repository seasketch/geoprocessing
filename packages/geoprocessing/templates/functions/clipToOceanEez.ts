import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import project from "../../project";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";

const clipOperationLoader = genClipOperationLoader(project, [
  {
    datasourceId: "global-clipping-osm-land",
    operation: "difference",
    options: {
      unionProperty: "gid",
    },
  },
  EEZ_CLIP_OPERATION,
]);

export const clipToOceanEez = genClipToPolygonPreprocessor(clipOperationLoader);

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description: "Example-description",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});

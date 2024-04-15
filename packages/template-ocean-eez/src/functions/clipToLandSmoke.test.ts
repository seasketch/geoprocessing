/**
 * @vitest-environment node
 */
import handler, { clipToLand } from "./clipToLand.js";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToLand, handler.options.title, {
  timeout: 20000,
  debug: true,
});

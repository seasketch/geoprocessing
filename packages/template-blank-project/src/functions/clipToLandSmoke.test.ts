/**
 * @jest-environment node
 * @group smoke
 */
import handler, { clipToLand } from "./clipToLand";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToLand, handler.options.title, {
  timeout: 20000,
  debug: true,
});

/**
 * @jest-environment node
 * @group smoke
 */
import handler, { clipToOcean } from "./clipToOcean";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToOcean, handler.options.title, {
  timeout: 20000,
  debug: true,
});

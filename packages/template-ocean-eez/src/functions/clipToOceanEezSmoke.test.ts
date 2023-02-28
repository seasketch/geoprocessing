/**
 * @jest-environment node
 * @group smoke
 */
import handler, { clipToOceanEez } from "./clipToOceanEez";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToOceanEez, handler.options.title, {
  timeout: 20000,
  debug: true,
});

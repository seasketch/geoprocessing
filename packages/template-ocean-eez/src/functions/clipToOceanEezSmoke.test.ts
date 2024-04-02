/**
 * @vitest-environment node
 */
import handler, { clipToOceanEez } from "./clipToOceanEez.js";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

// polygonPreprocessorSmokeTest(clipToOceanEez, handler.options.title, {
//   timeout: 20000,
//   debug: true,
// });

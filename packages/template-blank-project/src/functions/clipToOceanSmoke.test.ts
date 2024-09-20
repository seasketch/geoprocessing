/**
 * @vitest-environment node
 */
import handler, { clipToOcean } from "./clipToOcean.js";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

// polygonPreprocessorSmokeTest(clipToOcean, handler.options.title, {
//   timeout: 60000,
//   debug: true,
// });

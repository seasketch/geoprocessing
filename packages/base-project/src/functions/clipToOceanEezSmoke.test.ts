import handler, { clipToOceanEez } from "./clipToOceanEez.js";
import {
  polygonSmokeTest,
  getExampleFeatures,
} from "@seasketch/geoprocessing/scripts/testing";

const examples = await getExampleFeatures(); // Loads from examples/features directory
polygonSmokeTest(clipToOceanEez, handler.options.title, examples, {
  timeout: 60_000,
  debug: false,
});

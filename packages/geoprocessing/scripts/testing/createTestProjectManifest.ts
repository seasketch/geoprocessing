import { generateManifest } from "../build/generateManifest.js";
import { Package, GeoprocessingJsonConfig } from "../../src/types/index.js";
import { PreprocessingHandler, GeoprocessingHandler } from "../../src/index.js";
import { DEFAULTS as VECTOR_SOURCE_DEFAULTS } from "../../src/index.js";
import { point } from "@turf/turf";
import { PreprocessingBundle, GeoprocessingBundle } from "../types.js";
import { Manifest } from "../manifest.js";
import { TestComponentTypes } from "./types.js";

/**
 * Creates project core assets in-memory, with the components requested, and returns the resulting manifest
 * Useful for stubbing projects for testing purposes
 */
export default async function createTestProjectManifest(
  projectName: string,
  /** test components to add */
  components: TestComponentTypes[],
): Promise<Manifest> {
  // Create source package
  const pkgGeo: Package = {
    name: projectName,
    version: "1.0.0",
    description: `Test project with components ${components.join(", ")}`,
    dependencies: {},
    devDependencies: {},
    author: "Test",
    license: "UNLICENSED",
  };

  // Create project assets
  let gpConfig: GeoprocessingJsonConfig = {
    author: "Test <test@test.com>",
    organization: "Test Org",
    region: "us-west-1",
    preprocessingFunctions: [],
    geoprocessingFunctions: [],
    clients: [],
  };
  let preprocessingBundles: PreprocessingBundle[] = [];
  let geoprocessingBundles: GeoprocessingBundle[] = [];

  interface TestResult {
    result: number;
  }
  const testPpFunction = async () => {
    return point([0, 0]);
  };
  const testGpFunction = async (): Promise<TestResult> => {
    return { result: 50 };
  };
  const testSources = [
    {
      url: "https://testsource.com",
      options: VECTOR_SOURCE_DEFAULTS,
    },
  ];

  if (components.includes("preprocessor")) {
    gpConfig = {
      ...gpConfig,
      preprocessingFunctions: ["src/functions/testPreprocessor.ts"],
    };

    const pHandler = new PreprocessingHandler(testPpFunction, {
      title: "testPreprocessor",
      description: "",
      timeout: 1,
      requiresProperties: [],
      memory: 256, // test non-default value
    });

    preprocessingBundles = preprocessingBundles.concat({
      handler: pHandler.lambdaHandler,
      handlerFilename: "testPreprocessor.ts",
      options: pHandler.options,
      sources: testSources,
    });
  }

  if (components.includes("syncGeoprocessor")) {
    gpConfig = {
      ...gpConfig,
      geoprocessingFunctions: [
        ...gpConfig.geoprocessingFunctions,
        "src/functions/testSyncGeoprocessor.ts",
      ],
    };

    const sgHandler = new GeoprocessingHandler<TestResult>(testGpFunction, {
      title: "testSyncGeoprocessor",
      description: "",
      timeout: 2,
      executionMode: "sync",
      requiresProperties: [],
    });

    geoprocessingBundles = geoprocessingBundles.concat({
      handler: sgHandler.lambdaHandler,
      handlerFilename: "testSyncGeoprocessor.ts",
      options: sgHandler.options,
      sources: testSources,
    });
  }

  if (components.includes("asyncGeoprocessor")) {
    gpConfig = {
      ...gpConfig,
      geoprocessingFunctions: [
        ...gpConfig.geoprocessingFunctions,
        "src/functions/testAsyncGeoprocessor.ts",
      ],
    };

    const agHandler = new GeoprocessingHandler<TestResult>(testGpFunction, {
      title: "testAsyncGeoprocessor",
      description: "",
      timeout: 2,
      executionMode: "async",
      requiresProperties: [],
    });

    geoprocessingBundles = geoprocessingBundles.concat({
      handler: agHandler.lambdaHandler,
      handlerFilename: "testAsyncGeoprocessor.ts",
      options: agHandler.options,
      sources: testSources,
    });
  }

  if (components.includes("client")) {
    gpConfig = {
      ...gpConfig,
      clients: [
        ...gpConfig.clients,
        {
          name: "TestClient",
          description: "client description",
          source: "src/clients/TestClient.tsx",
        },
      ],
    };
  }

  return generateManifest(
    gpConfig,
    pkgGeo,
    preprocessingBundles,
    geoprocessingBundles,
    pkgGeo.version,
  );
}

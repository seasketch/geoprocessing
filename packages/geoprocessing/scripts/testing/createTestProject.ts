import { generateManifest } from "../build/generateManifest";
import {
  GeoprocessingJsonConfig,
  Sketch,
  SketchCollection,
  Feature,
  FeatureCollection,
  Polygon,
  Point,
} from "../../src/types";
import { PreprocessingHandler, GeoprocessingHandler } from "../../src";
import { DEFAULTS as VECTOR_SOURCE_DEFAULTS } from "../../src/VectorDataSource";
import { point } from "@turf/helpers";
import { Package, PreprocessingBundle, GeoprocessingBundle } from "../types";
import { Manifest } from "../manifest";

export type TestComponentTypes =
  | "preprocessor"
  | "syncGeoprocessor"
  | "asyncGeoprocessor"
  | "client";

/**
 * Creates project core assets in-memory, with the components requested, and returns the resulting manifest
 * Useful for stubbing projects for testing purposes
 */
export default async function createTestProject(
  projectName: string,
  /** test components to add */
  components: TestComponentTypes[]
): Promise<Manifest> {
  if (components.length === 0)
    throw new Error("createTestProject called with no components");

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
  const testPpFunction = async (feature: Feature<Point>) => {
    return point([0, 0]);
  };
  const testGpFunction = async (
    feature: Feature | FeatureCollection
  ): Promise<TestResult> => {
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
    pkgGeo.version
  );
}

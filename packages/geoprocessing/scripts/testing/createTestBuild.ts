import { generateManifest } from "../build/generateManifest.js";
import {
  Package,
  Feature,
  FeatureCollection,
  Point,
  GeoprocessingJsonConfig,
} from "../../src/types/index.js";
import { PreprocessingHandler, GeoprocessingHandler } from "../../src/index.js";
import { DEFAULTS as VECTOR_SOURCE_DEFAULTS } from "../../src/index.js";
import { point } from "@turf/helpers";
import { PreprocessingBundle, GeoprocessingBundle } from "../types.js";
import { Manifest } from "../manifest.js";
import { TestComponentTypes } from "./types.js";
import { setupBuildDirs } from "../testing/lifecycle.js";
import { generateHandler } from "../build/generateHandler.js";
import fs from "fs-extra";
import { buildProjectFunctions } from "../build/buildProjectFunctions.js";

/**
 * Creates test project build, with the components requested, at project path and returns the resulting manifest
 */
export default async function createTestBuild(
  projectName: string,
  projectPath: string,
  /** test components to add */
  components: TestComponentTypes[]
): Promise<Manifest> {
  await setupBuildDirs(projectPath);

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
  fs.writeJSONSync(`${projectPath}/package.json`, pkgGeo);

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

  // in-memory preprocessor function stub
  const testPpFunction = async (feature: Feature<Point>) => {
    return point([0, 0]);
  };

  // in-memory geoprocessing function stub
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

    // write handler to test build path that imports testPreprocessor
    fs.writeFileSync(
      `${projectPath}/.build/testPreprocessor.ts`,
      `
      import { Feature, Point } from "geojson";
      import { point } from "@turf/helpers";
      import { PreprocessingHandler } from "../../../../src/aws"

      const clipToLand = async (feature: Feature<Point>) => {
        return point([0, 0]);
      };

      export default new PreprocessingHandler(clipToLand, {
        title: "clipToLand",
        description: "Clips portion of feature or sketch not overlapping land",
        timeout: 40,
        requiresProperties: [],
        memory: 4096,
      });
      `
    );

    generateHandler(
      `${projectPath}/.build/testPreprocessor.ts`,
      `${projectPath}/.build`
    );

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

  fs.ensureDirSync(`${projectPath}/project`);
  fs.writeJSONSync(`${projectPath}/project/geoprocessing.json`, gpConfig);

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

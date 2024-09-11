import {
  isGeoprocessingFunctionMetadata,
  isPreprocessingFunctionMetadata,
  isSyncFunctionMetadata,
  isAsyncFunctionMetadata,
  hasClients,
  getSyncFunctionMetadata,
  getAsyncFunctionMetadata,
} from "./manifest.js";
import createTestProjectManifest from "./testing/createTestProjectManifest.js";
import { describe, test, expect } from "vitest";

describe("manifest helpers", () => {
  test("manifest has no clients", async () => {
    const manifest = await createTestProjectManifest("test", []);
    expect(manifest.clients.length).toEqual(0);
    expect(hasClients(manifest)).toEqual(false);
  });

  test("manifest has clients", async () => {
    const manifest = await createTestProjectManifest("test", ["client"]);
    expect(manifest.clients.length).toEqual(1);
    expect(hasClients(manifest)).toEqual(true);
  });

  test("getSyncFunctionMetadata", async () => {
    const manifest = await createTestProjectManifest("test", [
      "syncGeoprocessor",
      "asyncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(2);
    const syncMetas = getSyncFunctionMetadata(manifest);
    expect(syncMetas.length).toEqual(1);
    expect(isSyncFunctionMetadata(syncMetas[0])).toBe(true);
  });

  test("getAsyncFunctionMetadata", async () => {
    const manifest = await createTestProjectManifest("test", [
      "syncGeoprocessor",
      "asyncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(2);
    const asyncMetas = getAsyncFunctionMetadata(manifest);
    expect(asyncMetas.length).toEqual(1);
    expect(isAsyncFunctionMetadata(asyncMetas[0])).toBe(true);
  });
});

describe("manifest validators", () => {
  test("isGeoprocessingFunctionMetadata returns true for sync geoprocessor", async () => {
    const manifest = await createTestProjectManifest("test", [
      "syncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(1);
    expect(
      isGeoprocessingFunctionMetadata(manifest.geoprocessingFunctions[0]),
    ).toEqual(true);
  });

  test("isGeoprocessingFunctionMetadata returns true for async geoprocessor", async () => {
    const manifest = await createTestProjectManifest("test", [
      "asyncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(1);
    expect(
      isGeoprocessingFunctionMetadata(manifest.geoprocessingFunctions[0]),
    ).toEqual(true);
  });

  test("isGeoprocessingFunctionMetadata returns false for sync preprocessor", async () => {
    const manifest = await createTestProjectManifest("test", ["preprocessor"]);
    expect(manifest.geoprocessingFunctions.length).toEqual(0);
    expect(
      isGeoprocessingFunctionMetadata(manifest.preprocessingFunctions[0]),
    ).toEqual(false);
  });

  test("isPreprocessingFunctionMetadata returns true", async () => {
    const manifest = await createTestProjectManifest("test", ["preprocessor"]);
    expect(manifest.preprocessingFunctions.length).toEqual(1);
    expect(
      isPreprocessingFunctionMetadata(manifest.preprocessingFunctions[0]),
    ).toEqual(true);
  });

  test("isPreprocessingFunctionMetadata returns false", async () => {
    const manifest = await createTestProjectManifest("test", [
      "syncGeoprocessor",
    ]);
    expect(manifest.preprocessingFunctions.length).toEqual(0);
    expect(
      isPreprocessingFunctionMetadata(manifest.geoprocessingFunctions[0]),
    ).toEqual(false);
  });

  test("isSyncFunctionMetadata returns true", async () => {
    const manifest = await createTestProjectManifest("test", [
      "syncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(1);
    expect(isSyncFunctionMetadata(manifest.geoprocessingFunctions[0])).toEqual(
      true,
    );
  });

  test("isSyncFunctionMetadata returns false", async () => {
    const manifest = await createTestProjectManifest("test", [
      "asyncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(1);
    expect(isSyncFunctionMetadata(manifest.geoprocessingFunctions[0])).toEqual(
      false,
    );
  });

  test("isAsyncFunctionMetadata returns true", async () => {
    const manifest = await createTestProjectManifest("test", [
      "asyncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(1);
    expect(isAsyncFunctionMetadata(manifest.geoprocessingFunctions[0])).toEqual(
      true,
    );
  });

  test("isAsyncFunctionMetadata returns false", async () => {
    const manifest = await createTestProjectManifest("test", [
      "syncGeoprocessor",
    ]);
    expect(manifest.geoprocessingFunctions.length).toEqual(1);
    expect(isAsyncFunctionMetadata(manifest.geoprocessingFunctions[0])).toEqual(
      false,
    );
  });
});

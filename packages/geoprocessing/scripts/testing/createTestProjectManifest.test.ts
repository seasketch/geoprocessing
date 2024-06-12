import createTestProjectManifest from "./createTestProjectManifest.js";

describe("createTestProjectManifest", () => {
  const projectName = "test-project";
  it("should allow no components", async () => {
    const manifest = await createTestProjectManifest(projectName, []);
    expect(manifest).toBeTruthy();
    expect(manifest.preprocessingFunctions.length).toBe(0);
    expect(manifest.geoprocessingFunctions.length).toBe(0);
    expect(manifest.clients.length).toBe(0);
    expect(manifest.title).toBe(projectName);
  });

  it("should create a valid manifest", async () => {
    const manifest = await createTestProjectManifest(projectName, [
      "preprocessor",
      "syncGeoprocessor",
      "asyncGeoprocessor",
      "client",
    ]);
    expect(manifest).toBeTruthy();
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.geoprocessingFunctions.length).toBe(2);
    expect(manifest.clients.length).toBe(1);
    expect(manifest.title).toBe(projectName);

    const client = manifest.clients.find((c) => c.title === "TestClient");
    expect(client).toBeTruthy();

    const syncPF = manifest.preprocessingFunctions.find(
      (f) => f.title === "testPreprocessor"
    );
    expect(syncPF).toBeTruthy();
    expect(syncPF?.hasOwnProperty("executionMode")).toBe(false);
    expect(syncPF?.purpose).toBe("preprocessing");
    expect(syncPF?.handlerFilename).toBe("testPreprocessor.ts");
    expect(syncPF?.type).toBe("javascript");

    const syncGF = manifest.geoprocessingFunctions.find(
      (f) => f.title === "testSyncGeoprocessor"
    );
    expect(syncGF).toBeTruthy();
    expect(syncGF?.executionMode).toBe("sync");
    expect(syncGF?.purpose).toBe("geoprocessing");
    expect(syncGF?.handlerFilename).toBe("testSyncGeoprocessor.ts");
    expect(syncGF?.type).toBe("javascript");

    const asyncGF = manifest.geoprocessingFunctions.find(
      (f) => f.title === "testAsyncGeoprocessor"
    );
    expect(asyncGF).toBeTruthy();
    expect(asyncGF?.executionMode).toBe("async");
    expect(asyncGF?.purpose).toBe("geoprocessing");
    expect(asyncGF?.handlerFilename).toBe("testAsyncGeoprocessor.ts");
    expect(asyncGF?.type).toBe("javascript");
  });
});

import path from "path";
import createTestProject from "./createTestProject";

describe("createTestProject", () => {
  const projectName = "test-project";
  it("should require at least one component", async () => {
    expect(
      async () => await createTestProject(projectName, [])
    ).rejects.toThrow(Error);
  });

  it("should create a valid manifest", async () => {
    const manifest = await createTestProject(projectName, [
      "preprocessor",
      "syncGeoprocessor",
      "asyncGeoprocessor",
      "client",
    ]);
    expect(manifest.geoprocessingFunctions.length).toBe(2);
    expect(manifest).toBeTruthy();
    expect(manifest.preprocessingFunctions.length).toBe(1);
    expect(manifest.title).toBe(projectName);
  });
});

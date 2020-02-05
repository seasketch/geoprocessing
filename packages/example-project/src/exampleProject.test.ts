import fs from "fs";
import GeoprocessingHandler from "./functions/area";

describe("Project metadata settings", () => {
  test("package.json", () => {
    const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
    expect(packageJson.name).toBe("example-project");
    expect(packageJson.description).toBe(
      "Example project to test geoprocessing project init scripts"
    );
    expect(packageJson.license).toBe("BSD-3-Clause");
    expect(packageJson.author).toBe("Chad Burt");
    expect(packageJson.repository.url).toBe(
      "git+https://github.com/seasketch/example-project.git"
    );
    const geoprocessingJson = JSON.parse(
      fs.readFileSync("geoprocessing.json").toString()
    );
    expect(geoprocessingJson.author).toBe("Chad Burt <support@seasketch.org>");
    expect(geoprocessingJson.organization).toBe("SeaSketch");
    expect(geoprocessingJson.region).toBe("us-west-1");
  });

  test("correct files copied over", () => {
    expect(fs.existsSync("tsconfig.json")).toBeTruthy();
    expect(fs.existsSync(".nvmrc")).toBeTruthy();
    expect(fs.existsSync(".gitignore")).toBeTruthy();
    expect(fs.existsSync("data/Dockerfile")).toBeTruthy();
    expect(fs.existsSync("data/docker-compose.yml")).toBeTruthy();
    expect(fs.existsSync("examples/sketches/sketch.json")).toBeTruthy();
  });

  test("gp function and test case created", () => {
    expect(fs.existsSync("src/functions/area.ts")).toBeTruthy();
    expect(fs.existsSync("src/functions/area.test.ts")).toBeTruthy();
  });

  test("function metadata set correctly", () => {
    expect(GeoprocessingHandler.options.title).toBe("area");
    expect(GeoprocessingHandler.options.description).toBe(
      "Produces the area of the given sketch"
    );
    expect(GeoprocessingHandler.options.executionMode).toBe("sync");
  });
});

// TODO: check that typescript choice was interpreted correctly

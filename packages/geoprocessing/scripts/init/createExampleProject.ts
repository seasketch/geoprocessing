import makeProject from "./init";
import { makeGeoprocessingHandler } from "./createFunction";
import { makeClient } from "./createClient";
import fs from "fs-extra";

const PATH = `packages/example-project`;

(async () => {
  const inLernaProjectRoot = await fs.pathExists("./lerna.json");
  if (!inLernaProjectRoot) {
    throw new Error(
      "createExampleProject is designed to be run from multi-project repo root."
    );
  }
  const pathExists = await fs.pathExists(PATH);
  if (pathExists) {
    await fs.remove(PATH);
  }
  await makeProject(
    {
      name: "example-project",
      description: "Example project to test geoprocessing project scripts",
      author: "Test",
      email: "test@test.com",
      license: "UNLICENSED",
      organization: "Test Org",
      repositoryUrl: "https://github.com/seasketch/example-project",
      region: "us-west-1",
      templates: [],
    },
    false,
    PATH.split("/").slice(0, -1).join("/")
  );
  await makeGeoprocessingHandler(
    {
      title: "area",
      typescript: true,
      description: "Produces the area of the given sketch",
      docker: false,
      executionMode: "sync",
    },
    false,
    PATH + "/"
  );
  await fs.copyFile(
    `${__dirname}/../../../templates/exampleProject.test.ts`,
    PATH + "/src/exampleProject.test.ts"
  );
  await makeClient(
    {
      title: "AreaClient",
      description: "My client description",
      typescript: true,
    },
    false,
    PATH + "/"
  );

  const pkg = JSON.parse(fs.readFileSync(PATH + "/package.json").toString());
  pkg.private = true;
  const curGpVersion = JSON.parse(
    fs.readFileSync(`${__dirname}/../../../package.json`).toString()
  ).version;
  pkg.devDependencies["@seasketch/geoprocessing"] = curGpVersion;
  fs.writeFileSync(PATH + "/package.json", JSON.stringify(pkg, null, "  "));
})();

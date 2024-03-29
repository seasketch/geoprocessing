#!/usr/bin/env zx
// import { createProject } from "../../dist/scripts/init/createProject.js";
// import "zx/globals";

// const gpVersion = process.env.GP_VERSION;
// if (!gpVersion) {
//   console.log("Missing GP_VERSION, will use the latest stable from npm");
// } else {
//   console.log(`Using GP_VERSION ${gpVersion} from NPM (make sure it exists)`);
//   console.log();
// }

// await $`rm -rf test-projects`;
// await $`mkdir test-projects`;
// await cd("./test-projects");

// try {
//   // Create empty project
//   await createProject({
//     name: "gp-test-empty",
//     description: "Empty test project",
//     repositoryUrl: "",
//     author: "Test",
//     email: "test@test.com",
//     organization: "Tester",
//     license: "BSD-3-Clause",
//     region: "us-west-1",
//     templates: [],
//     ...(gpVersion ? { gpVersion } : {}),
//   });
//   await cd("./gp-test-empty");
//   await $`npm install`;
//   await $`npm run build`;
//   await $`npm run destroy`; // just to make sure
//   await $`npm run deploy`;
//   // insert api tests here
//   await $`npm run destroy`; // all done with this stack
//   await cd("..");
// } catch (err) {
//   await $`npm run destroy`; // all done with this stack
//   await cd("..");
// }

// next stack up

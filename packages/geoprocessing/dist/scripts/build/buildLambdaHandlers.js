"use strict";
// const { rollup } = require("rollup");
// const typescript = require("@rollup/plugin-typescript");
// // const typescript = require("rollup-plugin-typescript2");
// const json = require("@rollup/plugin-json");
// // import sizes from "rollup-plugin-sizes";
// const fs = require("fs-extra");
// const virtual = require("@rollup/plugin-virtual");
// const inputOptions = {
//   input: [
//     // "src/test.ts"
//     require.resolve("../../src/serviceHandlers.js")
//   ],
//   plugins: [
//     json(),
//     typescript({
//       tsconfig: require.resolve("../../tsconfig-rollup.json")
//       // tsconfigOverride: {
//       //   exclude: [],
//       //   include: ["*.ts+(|x)", "**/*.ts+(|x)", "**/*.js"]
//       // },
//       // include: ["*.ts+(|x)", "**/*.ts+(|x)", "**/*.js"],
//       // verbosity: 2,
//       // cwd: __dirname + "/../",
//       // clean: true
//     })
//     // sizes()
//   ],
//   treeshake: {
//     moduleSideEffects: false
//   },
//   external: [
//     // testing deps. not needed in production
//     "fs-extra"
//     // used for sketchArea and will be copied manually
//     // "@turf/area"
//   ]
// };
// const outputOptions = {
//   format: "cjs",
//   dir: process.env.OUT,
//   plugins: []
// };
// async function buildLambdaHandlers(projectPath: string) {
//   const config = await fs.readJSON(projectPath + "/geoprocessing.json");
//   const functionPaths = config.functions || [];
//   const pkg = await fs.readJSON(projectPath + "/package.json");
//   config.title = pkg.name;
//   config.relatedUri = pkg.homepage;
//   config.sourceUri = pkg.repository ? pkg.repository.url : null;
//   config.published = new Date().toISOString();
//   console.log(config);
//   const virtualOpts = {
//     "geoprocessing-json-config": `export default ${JSON.stringify(config)};`
//   };
//   inputOptions.plugins.push(virtual(virtualOpts));
//   // Get function metadata and build handlers
//   // This is going to get stupid, but we need to get metadata from the handler
//   // definitions in the project implementation. Importing
//   // Add geoprocessing functions
//   for (const functionPath of functionPaths) {
//     console.log(projectPath + "/" + functionPath + ".ts");
//     // const handler = require(projectPath + "/" + functionPath + ".ts");
//     // console.log("handler", handler);
//     // if (handler.options && handler.options.executionMode) {
//     //   inputOptions.input.push(functionPath + ".ts");
//     // } else {
//     //   throw new Error(
//     //     `Code at ${functionPath} does not appear to be a valid GeoprocessingHandler`
//     //   );
//     // }
//   }
//   // Generate and write build
//   outputOptions.dir = projectPath + "/.build";
//   try {
//     const bundle = await rollup(inputOptions);
//     await bundle.write(outputOptions);
//   } catch (e) {
//     console.log("ROLLUP ERROR!!!");
//     console.error(e);
//     process.exit(-1);
//   }
//   // Copy common dependencies from @seasketch/geoprocessing
//   const nodeModules = `${projectPath}/node_modules/`;
//   const packageModules = `${__dirname}/../../node_modules/`;
//   if (!fs.existsSync(nodeModules)) {
//     await fs.mkdir(nodeModules);
//   }
//   await fs.copy(packageModules + "@turf", nodeModules + "/@turf");
//   // Copy project dependencies
// }
// (async function() {
//   await buildLambdaHandlers(process.env.PROJECT_PATH!);
// })();
//# sourceMappingURL=buildLambdaHandlers.js.map
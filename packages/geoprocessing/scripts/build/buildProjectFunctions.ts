import fs from "fs-extra";
import path from "path";
import * as esbuild from "esbuild";
import { generateManifest } from "./generateManifest.js";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { PreprocessingBundle, GeoprocessingBundle } from "../types.js";
import { getHandlerFilenameFromSrcPath } from "../util/handler.js";
import { Package } from "../../src/types/index.js";
import { generateHandler } from "./generateHandler.js";

/**
 * Builds project geoprocessing and preprocessing functions
 * @param projectPath - project path containing package.json, geoprocessing.json, and geoprocessing or preprocessing functions
 * @param destBuildPath - path to write bundled functions to
 */
export async function buildProjectFunctions(
  projectPath: string,
  destBuildPath: string,
) {
  if (!fs.existsSync(destBuildPath)) {
    fs.mkdirSync(destBuildPath);
  }

  const geoprocessing: GeoprocessingJsonConfig = JSON.parse(
    fs
      .readFileSync(path.join(projectPath, "project", "geoprocessing.json"))
      .toString(),
  );

  const packageGp: Package = JSON.parse(
    fs.readFileSync("./package.json").toString(),
  );

  const packageProject: Package = JSON.parse(
    fs.readFileSync(path.join(projectPath, "package.json")).toString(),
  );

  if (
    !geoprocessing.preprocessingFunctions &&
    !geoprocessing.geoprocessingFunctions
  ) {
    throw new Error("No functions found in geoprocessing.json");
  }

  // For each project function generate root lambda function and bundle into single JS file with all dependencies
  const functionPaths = [
    ...geoprocessing.geoprocessingFunctions,
    ...geoprocessing.preprocessingFunctions,
  ];

  if (process.env.NODE_ENV !== "test")
    console.log("Bundling functions found in geoprocessing.json...\n");

  await Promise.all(
    functionPaths.map(async (functionPath) => {
      // generate function (lambda handler) that wraps the preprocessing or geoprocessing function
      // the handler is the entry point for the lmabda and receives the event (payload) from the API gateway
      // and passes it on
      const handlerPath = generateHandler(
        path.join(projectPath, functionPath),
        destBuildPath,
      );
      const handlerDestPath = `${path.basename(functionPath)}`.replace(
        ".ts",
        "Handler.mjs",
      );

      // Build a local npm package for the function
      const pkgName = handlerDestPath.replace(".mjs", "");
      const pkgPath = path.join(destBuildPath, pkgName).replace("Handler", "");
      const bundledPath = path.join(pkgPath, handlerDestPath);

      fs.ensureDirSync(pkgPath);

      // Build esm bundle with all dependencies
      const buildResult = await esbuild.build({
        entryPoints: [handlerPath],
        bundle: true,
        outfile: bundledPath,
        platform: "node",
        format: "esm",
        logLevel: process.env.NODE_ENV === "test" ? "error" : "info",
        sourcemap: false,
        external: ["aws-cdk-lib", "aws-sdk"],
        banner: {
          // workaround require bug https://github.com/evanw/esbuild/pull/2067#issuecomment-1324171716
          js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
        },
      });

      if (buildResult.errors.length > 0 || buildResult.warnings.length > 0) {
        console.log(JSON.stringify(buildResult, null, 2));
      }

      // package.json with type: module, needed in the build directory containing handlers in order to enable ESM runtime in lambda
      // WRITE A FUNCTION THAT GENERATES PACKAGE.JSON that points to handler
      fs.writeJSONSync(
        path.join(pkgPath, "package.json"),
        {
          name: handlerDestPath,
          type: "module",
          description: "This package will be treated as an ES module.",
          version: "1.0",
          main: handlerDestPath,
        },
        { spaces: 2 },
      );
    }),
  );

  // package.json with type: module, needed in the build directory containing handlers in order to enable ESM runtime in lambda
  fs.writeJSONSync(
    path.join(destBuildPath, "package.json"),
    {
      name: "gp-project-build",
      type: "module",
      description: "This package will be treated as an ES module.",
      version: "1.0",
      main: "index.js",
    },
    { spaces: 2 },
  );

  // OTHER_FUNCTIONS

  if (process.env.NODE_ENV !== "test")
    console.log("\nBundling support functions...\n");

  const otherFunctions = [
    "src/aws/serviceHandlers.ts",
    "src/sockets/sendmessage.ts",
    "src/sockets/connect.ts",
    "src/sockets/disconnect.ts",
  ];

  await Promise.all(
    otherFunctions.map(async (functionPath) => {
      const bundledName = path.basename(functionPath).replace(".ts", ".mjs");
      const functionName = bundledName.replace(".mjs", "");
      const bundledPath = path.join(destBuildPath, functionName, bundledName);
      const pkgPath = path.join(destBuildPath, functionName);

      const minify = process.env.NOMINIFY ? false : true;

      const buildResult = await esbuild.build({
        entryPoints: [functionPath],
        bundle: true,
        outfile: bundledPath,
        platform: "node",
        format: "esm",
        logLevel: process.env.NODE_ENV === "test" ? "error" : "info",
        minify: minify,
        treeShaking: true,
        metafile: true,
        sourcemap: false,
        external: ["aws-cdk-lib"], // keep aws-sdk until migrate to v3 built into lambda
        banner: {
          // workaround require bug https://github.com/evanw/esbuild/pull/2067#issuecomment-1324171716
          js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
        },
      });
      if (
        process.env.NODE_ENV !== "test" &&
        (buildResult.errors.length > 0 || buildResult.warnings.length > 0)
      ) {
        console.log(JSON.stringify(buildResult, null, 2));
      }

      if (buildResult.metafile && process.env.ANALYZE) {
        if (process.env.NODE_ENV !== "test")
          console.log("Generating metafile esbuild-metafile-lambda.json"); // use https://bundle-buddy.com/esbuild to analyze
        await fs.writeFile(
          `${projectPath}/esbuild-metafile-lambda.json`,
          JSON.stringify(buildResult.metafile),
        );
      }

      // package.json with type: module (to enable ESM) and entry point to lambda hander
      fs.writeJSONSync(
        path.join(pkgPath, "package.json"),
        {
          name: bundledName,
          type: "module",
          description: "This package will be treated as an ES module.",
          version: "1.0",
          main: bundledName,
        },
        { spaces: 2 },
      );
    }),
  );

  // MANIFEST

  /**
   * Given full path to source geoprocessing function, requires and returns its pre-generated handler module
   */
  async function getHandlerModule(srcFuncPath: string) {
    const name = getHandlerFilenameFromSrcPath(srcFuncPath);
    const p = path.join(destBuildPath, name);
    return await import(p);
  }

  const preprocessingBundles: PreprocessingBundle[] =
    geoprocessing.preprocessingFunctions &&
    (await Promise.all(
      geoprocessing.preprocessingFunctions.map(getHandlerModule),
    ));
  const geoprocessingBundles: GeoprocessingBundle[] =
    geoprocessing.geoprocessingFunctions &&
    (await Promise.all(
      geoprocessing.geoprocessingFunctions.map(getHandlerModule),
    ));

  const manifest = generateManifest(
    geoprocessing,
    packageProject,
    preprocessingBundles,
    geoprocessingBundles,
    packageGp.version,
  );
  const manifestPath = path.join(destBuildPath, "manifest.json");
  if (process.env.NODE_ENV !== "test")
    console.log(`\nCreating service manifest ${manifestPath}\n`);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, "  "));

  fs.copyFileSync(
    manifestPath,
    path.join(destBuildPath, "serviceHandlers", "manifest.json"),
  );
}

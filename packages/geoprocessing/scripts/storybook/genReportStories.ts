import fs from "fs-extra";
import path, { extname } from "path";
import { globby } from "globby";
import { Sketch } from "../../src/types/sketch.js";
import { GpStoryConfig } from "../../src/storybook/types.js";

// Load example sketches

if (!process.env.PROJECT_PATH) {
  throw new Error("PROJECT_PATH environment variable not set");
}
const PROJECT_PATH: string = process.env.PROJECT_PATH;

const sketchDir = path.join(PROJECT_PATH, "examples", "sketches");
if (!fs.existsSync(sketchDir)) {
  throw new Error(`Example sketch path ${sketchDir} does not exist`);
}

const outputDir = path.join(PROJECT_PATH, "examples", "output");
if (!fs.existsSync(outputDir)) {
  throw new Error(`Example output path ${outputDir} does not exist`);
}

const storyDir = path.join(PROJECT_PATH, "src");

// load report story configs
const storyPaths = await globby(path.join(storyDir, "**/*.report-stories.ts"), {
  onlyFiles: true,
});
const storyConfigs: GpStoryConfig[] = [];
for (const storyPath of storyPaths) {
  try {
    const { storyConfig } = await import(storyPath);
    storyConfigs.push({
      ...storyConfig,
      path: storyPath,
    });
  } catch (e) {
    console.log(`Trouble parsing example ${storyPath}`);
  }
}

// load project sketches, that are not from templates (sketch filename is prefixed with gp)
const sketchFilenames = fs
  .readdirSync(sketchDir)
  .filter((sketchFilename) => path.extname(sketchFilename) === ".json")
  .filter(
    (sketchFilename) =>
      path.basename(sketchFilename).startsWith("gp", 0) === false
  );
const sketches: Sketch[] = [];
for (const sketchFilename of sketchFilenames) {
  try {
    const sketch: Sketch = fs.readJSONSync(
      path.join(sketchDir, sketchFilename)
    ) as Sketch;
    if (sketch && sketch.properties.name) {
      sketches.push(sketch);
    }
  } catch (e) {
    console.log(`Trouble parsing example ${sketchFilename}`);
  }
}

// Load related example outputs
const outputs: { sketchName: string; results: any; functionName: string }[] =
  [];
for (const sketch of sketches) {
  const outputPath = path.join(outputDir, sketch.properties.name);
  if (fs.existsSync(outputPath)) {
    const outputFilenames = fs.readdirSync(outputPath);
    for (const outputFilename of outputFilenames) {
      if (path.extname(outputFilename) === ".json") {
        outputs.push({
          sketchName: sketch.properties.name,
          results: fs.readJSONSync(path.join(outputPath, outputFilename)),
          functionName: path.basename(outputFilename, ".json"),
        });
      }
    }
  }
}

// Generate stories

for (const storyConfig of storyConfigs) {
  for (const sketch of sketches) {
    console.log("generating story for sketch", sketch.properties.name);

    // Pull out relative path from import string and replace with path that will work from story cache subdirectory

    if (!fs.existsSync(storyConfig.path!)) {
      console.log(
        `Story config path ${storyConfig.path} does not exist, skipping`
      );
      continue;
    }
    const importFromCacheStr = `../${storyConfig.componentPath}`.replace(
      ".ts",
      ".js"
    );

    const storyTitleSplit = storyConfig.title.split("/");
    // extract story name from title
    const storyName = storyTitleSplit[storyTitleSplit.length - 1];
    const storyOutDir = path.join(
      path.dirname(storyConfig.path!),
      ".story-cache"
    );
    const storyOutPath = path.join(
      storyOutDir,
      `${storyName}-${sketch.properties.name}.stories.tsx`
    );

    const exampleOutputs = outputs.filter((output) => {
      return output.sketchName === sketch.properties.name;
    });
    if (!exampleOutputs) {
      console.log(
        `No results found for sketch ${sketch.properties.name}, skipping`
      );
      continue;
    }

    const story = `
      import React from "react";
      import { ${storyConfig.componentName} } from '${importFromCacheStr}';
      import {
        createReportDecorator,
        sampleSketchReportContextValue,
      } from "@seasketch/geoprocessing/client-ui";
      import Translator from "${path.join(PROJECT_PATH, "src", "components", "TranslatorAsync.js")}";

      const contextValue = sampleSketchReportContextValue({
        visibleLayers: [],
        exampleOutputs: ${JSON.stringify(exampleOutputs, null, 2)}
      });

      export const ${sketch.properties.name} = () => (
        <Translator>
          <${storyConfig.componentName} />
        </Translator>
      );

      export default {
        component: ${storyConfig.componentName},
        title: '${storyConfig.title}',
        decorators: [createReportDecorator(contextValue)],
      };
    `;

    fs.ensureDirSync(storyOutDir);
    if (fs.existsSync(storyOutPath)) {
      fs.rmSync(storyOutPath); // delete old story if it exists
    }
    fs.writeFileSync(storyOutPath, story);
  }
}

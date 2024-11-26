import fs from "fs-extra";
import {
  featureToSketchCollection,
  genFeature,
  genFeatureCollection,
  genRandomPolygons,
  FeatureCollection,
  Polygon,
} from "@seasketch/geoprocessing";
import { program } from "commander";
import project from "../project/projectClient.js";

/**
 * genRandomPolygon script - generates random feature polygon or sketch polygon within given bounding box.
 * npx tsx genRandomPolygon.ts --help for more info
 */

program
  .option("-o, --outDir <outDir>", "output directory")
  .option(
    "-b, --bbox <bbox>",
    "bounding box to constrain features [minX, minY, maxX, maxY]",
    JSON.stringify(project.basic.bbox) || "[-180, -90, 180, 90]",
  )
  .option(
    "-n, --numFeatures <numFeatures>",
    "number of Features to generate, if > 1 generates FeatureCollection",
    "1",
  )
  .option(
    "-f, --filename <name>",
    "name of the file, defaults to randomSketch.json or randomSketchCollection.json",
  )
  .option(
    "-s, --sketch",
    "generates Sketch polygon.  Defaults to Feature polygon",
  )
  .option(
    "-h, --bboxShrinkFactor <bboxShrinkFactor>",
    "factor to shrink bounding box by to ensure sketch is inside. 10 = 1/10th the size",
    "1",
  )
  .option(
    "-r, --maxRadialLength <maxRadialLength>",
    " maximum number of decimal degrees latitude or longitude that a vertex can reach out of the center of the Polygon Feature",
    "0.25",
  );
program.parse();
const options = program.opts();

// console.log("inOptions", options);

let bbox = JSON.parse(options.bbox);
const numFeatures = Number.parseInt(options.numFeatures) || 1;
const filename = options.filename;
const type = options.sketch === true ? "Sketch" : "Feature";
const bboxShrinkFactor = Number.parseInt(options.bboxShrinkFactor);
const outdir =
  type === "Sketch"
    ? `${import.meta.dirname}/../examples/sketches/`
    : `${import.meta.dirname}/../examples/features/`;

const [minX, minY, maxX, maxY] = bbox;
if (
  minX >= maxX ||
  minY >= maxY ||
  minX < -180 ||
  maxX > 180 ||
  minY < -90 ||
  maxY > 90
) {
  throw new Error("Invalid bounding box");
}

const width = Math.abs(maxX - minX);
const height = Math.abs(maxY - minY);
const center = [minX + width / 2, minY + height / 2];
// console.log("width", width);
// console.log("height", height);
// console.log("center", center);
const insideMinX = center[0] - width / (2 * bboxShrinkFactor);
const insideMinY = center[1] - height / (2 * bboxShrinkFactor);
const insideMaxX = center[0] + width / (2 * bboxShrinkFactor);
const insideMaxY = center[1] + height / (2 * bboxShrinkFactor);

const insideBbox = [insideMinX, insideMinY, insideMaxX, insideMaxY];
bbox = insideBbox;

const maxRadialLength = Number.parseFloat(options.maxRadialLength);

const theFilename = (() => {
  if (filename) {
    return `${filename}`;
  } else if (numFeatures > 1) {
    return `random${type}Collection.json`;
  } else {
    return `random${type}.json`;
  }
})();
const outfile = `${outdir}${theFilename}`;

// remove the extension
const name = theFilename.slice(0, -5);

console.log("Output options:", {
  outfile,
  bbox,
  numFeatures,
  type,
  bboxShrinkFactor,
  maxRadialLength,
});

const sketch = (() => {
  const fc = genRandomPolygons({
    numPolygons: numFeatures,
    bounds: bbox,
    max_radial_length: maxRadialLength,
  }) as FeatureCollection<Polygon>;

  if (type === "Feature") {
    if (numFeatures === 1) {
      return genFeature({ feature: fc.features[0], name });
    } else {
      const feats = genFeatureCollection(fc.features, { name });
      return feats;
    }
  } else {
    const sc = featureToSketchCollection(fc, name);
    sc.properties.userAttributes = [
      {
        label: "Type",
        fieldType: "ChoiceField",
        exportId: "TYPE",
        value: "sketch collection",
      },
      {
        label: "Notes",
        value:
          "This is an adjustment of the previous proposal to better meet objectives",
        exportId: "NOTES",
        fieldType: "TextArea",
      },
    ];

    sc.features.forEach((f, i) => {
      sc.features[i].properties.userAttributes = [
        {
          label: "Type",
          fieldType: "ChoiceField",
          exportId: "TYPE",
          value: "sketch",
        },
        {
          label: "Notes",
          value:
            "This is a modification of the northern proposed area to account for the new requirements",
          exportId: "NOTES",
          fieldType: "TextArea",
        },
      ];
    });

    if (numFeatures === 1) {
      return sc.features[0];
    } else {
      return sc;
    }
  }
})();

await fs.remove(outfile);
fs.writeJSON(outfile, sketch, { spaces: 2 }, (err) => {
  if (err) throw err;
  console.log(`Sketches written to ${outfile}`);
});

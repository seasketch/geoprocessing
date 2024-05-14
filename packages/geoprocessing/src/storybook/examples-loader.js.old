const EXAMPLES = options.examplesPath;
const fs = require("fs");
const path = require("path");

// get project sketches, that are not from templates (sketch filename is prefixed with gp)
const fpaths = fs
  .readdirSync(path.join(EXAMPLES, "sketches"))
  .filter((sketchPath) => path.extname(sketchPath) === ".json")
  .filter(
    (sketchPath) => path.basename(sketchPath).startsWith("gp", 0) === false
  );
const sketches = [];
for (const p of fpaths) {
  try {
    const sketch = JSON.parse(
      fs.readFileSync(path.join(EXAMPLES, "sketches", p).toString())
    );
    if (sketch && sketch.properties.name) {
      sketches.push(sketch);
    }
  } catch (e) {
    console.log(`Trouble parsing example ${p}`);
  }
}

// get related example outputs
const outputs = [];
for (const sketch of sketches) {
  const outdir = path.join(EXAMPLES, "output", sketch.properties.name);
  if (fs.existsSync(outdir)) {
    const paths = fs.readdirSync(outdir);
    for (const outputpath of paths) {
      if (path.extname(outputpath) === ".json") {
        outputs.push({
          sketchName: sketch.properties.name,
          results: JSON.parse(
            fs.readFileSync(path.join(outdir, outputpath)).toString()
          ),
          functionName: path.basename(outputpath, ".json"),
        });
      }
    }
  }
}

const examples = {
  sketches,
  outputs: outputs,
};

export default {
  code: `module.exports = ${JSON.stringify(examples, null, "  ")};`,
  contextDependencies: [options.examplesPath],
};

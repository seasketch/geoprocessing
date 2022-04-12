import { buildFileIndex } from "@seasketch/heatmap-cli";

async function build() {
  // const { buildFileIndex } = await import(
  //   "@seasketch/heatmap-cli/buildFileIndex"
  // ); // async import converts to commonJS
  const infFile = "./community.geojson";
  const outDir = `./output`;

  buildFileIndex(infFile, outDir);
}

build();

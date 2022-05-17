import { buildFileIndex } from "@seasketch/heatmap-cli";

export function build() {
  // const { buildFileIndex } = await import("@seasketch/heatmap-cli"); // async import converts to commonJS
  const infFile = "./community.geojson";
  const outDir = `./output`;

  buildFileIndex(infFile, outDir);
}

build();

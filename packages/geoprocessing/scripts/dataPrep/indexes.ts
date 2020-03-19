import { BBox } from "geojson";
import Flatbush from "flatbush";
import expand from "./expand";

export interface CompositeIndexDetails {
  length: number;
  offset: number;
  index: Flatbush;
  bbox: BBox;
}

export function createIndexes(
  items: BBox[],
  compositeIndexTargetBytes: number,
  compositeIndexMinChunks: number,
  flatbushNodeSize: number
) {
  const index = new Flatbush(items.length, flatbushNodeSize);
  for (const bbox of items) {
    index.add(bbox[0], bbox[1], bbox[2], bbox[3]);
  }
  index.finish();
  // Create composite indexes
  const nCompositeIndexes = Math.max(
    Math.round(index.data.byteLength / compositeIndexTargetBytes),
    compositeIndexMinChunks
  );
  const chunkSize = Math.floor(items.length / nCompositeIndexes);
  const compositeIndexes = [];
  for (let i = 0; i < nCompositeIndexes; i++) {
    const isLast = i === nCompositeIndexes - 1;

    const bboxes = isLast
      ? items.slice(chunkSize * i)
      : items.slice(chunkSize * i, chunkSize * (i + 1));
    let extent: BBox | null = null;
    const index = new Flatbush(bboxes.length, flatbushNodeSize);
    for (const bbox of bboxes) {
      extent = expand(extent, bbox);
      index.add(bbox[0], bbox[1], bbox[2], bbox[3]);
    }
    index.finish();
    compositeIndexes.push({
      length: bboxes.length,
      offset: chunkSize * i,
      index: index,
      bbox: extent!
    });
  }
  return {
    index,
    compositeIndexes
  };
}

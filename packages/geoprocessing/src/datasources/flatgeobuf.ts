import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { BBox } from "../types";

//@ts-ignore
global["ReadableStream"] = ReadableStream;
//@ts-ignore
global["TextDecoder"] = TextDecoder;
global["TextEncoder"] = TextEncoder;

export { deserialize } from "flatgeobuf/lib/cjs/geojson";

export function fgBoundingBox(box: BBox) {
  return {
    minX: box[0],
    maxX: box[2],
    minY: box[1],
    maxY: box[3],
  };
}

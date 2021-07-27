import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { BBox } from "../types";

//@ts-ignore
global["ReadableStream"] = ReadableStream;

// support older nodejs
if (typeof TextDecoder === "undefined" && typeof require !== "undefined") {
  (global as any).TextDecoder = require("util").TextDecoder;
}
//@ts-ignore
global["TextDecoder"] = TextDecoder;

// support older nodejs
if (typeof TextEncoder === "undefined" && typeof require !== "undefined") {
  (global as any).TextEncoder = require("util").TextEncoder;
}
//@ts-ignore
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

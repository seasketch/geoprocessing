import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { takeAsync } from "flatgeobuf/lib/cjs/streams/utils";
import { BBox, GeometryTypes } from "../types";
import { deserialize } from "flatgeobuf/lib/cjs/geojson";

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

/** Fetch features within bounding box and deserializes them, awaiting all of them before returning.
 * Useful when running a spatial function on the whole set is faster than running
 * one at a time as the generator provides them
 */
export async function fetchAll<T = GeometryTypes>(url: string, box: BBox) {
  return (await takeAsync(
    deserialize(url, fgBoundingBox(box)) as AsyncGenerator
  )) as T[];
}

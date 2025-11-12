import { readFileSync } from "node:fs";
import { geojson } from "flatgeobuf";
import { takeAsync } from "flatgeobuf/lib/mjs/streams/utils.js";
import { deserialize } from "flatgeobuf/lib/mjs/geojson.js";
import { BBox, Feature, FeatureCollection, Geometry } from "../types/index.js";
import { callWithRetry } from "../helpers/callWithRetry.js";
import { genPresignedUrl } from "./presignedUrl.js";
import "./fetchPolyfill.js";

export interface FgBoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function fgBoundingBox(box: BBox): FgBoundingBox {
  return {
    minX: box[0],
    maxX: box[2],
    minY: box[1],
    maxY: box[3],
  };
}

/**
 * Fetch features from flatgeobuf at url that intersect with bounding box
 * Retries up to 3 times if fetch fails in error
 * @param url url of flatgeobuf file
 * @param bbox optional bounding box to fetch features that intersect with
 * @returns feature array
 * @deprecated Use `loadFgb` instead.
 */
export async function fgbFetchAll<F extends Feature<Geometry>>(
  url: string,
  box?: BBox,
) {
  return loadFgb<F>(url, box);
}

/**
 * Fetch features from flatgeobuf at url that intersect with bounding box
 * Retries up to 3 times if fetch fails in error
 * @param url url of flatgeobuf file
 * @param bbox optional bounding box to fetch features that intersect with
 * @returns feature array
 */
export async function loadFgb<F extends Feature<Geometry>>(
  url: string,
  bbox?: BBox,
) {
  // Convert to presigned URL if running in Lambda with private S3 bucket
  const signedUrl = await genPresignedUrl(url);

  const fgBox = (() => {
    if (!bbox && !Array.isArray(bbox)) {
      return fgBoundingBox([-180, -90, 180, 90]); // fallback to entire world
    } else {
      return fgBoundingBox(bbox);
    }
  })();

  if (process.env.NODE_ENV !== "test")
    console.log("loadFgb", `url: ${url}`, `box: ${JSON.stringify(fgBox)}`);

  // deserialize + takeAsync will await all features to be fetched
  const takeFeatures = (url: string, fgBox: FgBoundingBox) =>
    takeAsync(deserialize(url, fgBox) as AsyncGenerator);

  // retry up to 3 times if SocketError
  const features: F[] = (await callWithRetry(takeFeatures, [signedUrl, fgBox], {
    ifErrorMsgContains: "fetch failed",
  })) as F[];

  if (!Array.isArray(features))
    throw new Error("Unexpected result from loadFgb");
  return features;
}

/**
 * Synchronously load a flatgeobuf file from disk.  Assumed to be in WGS84 EPSG:4326 projection
 * @param path path to flatgeobuf file
 * @returns feature collection of features from disk
 */
export function loadFgbFromDisk<G extends Geometry>(path: string) {
  // Fetch all reef features and calculate total area
  const buffer = readFileSync(path);
  return geojson.deserialize(new Uint8Array(buffer)) as FeatureCollection<G>;
}

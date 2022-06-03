import { isSyncFunctionMetadata } from "../manifest";
import { SyncFunctionWithMeta, AsyncFunctionWithMeta } from "./types";

/** Returns true if sync function with meta and narrows type */
export const isSyncFunctionWithMeta = (
  funcWithMeta: any
): funcWithMeta is SyncFunctionWithMeta => {
  return (
    funcWithMeta.hasOwnProperty("func") &&
    funcWithMeta.hasOwnProperty("meta") &&
    isSyncFunctionMetadata(funcWithMeta.meta)
  );
};

/** Returns true if async function with meta and narrows type */
export const isAsyncFunctionWithMeta = (
  funcWithMeta: any
): funcWithMeta is AsyncFunctionWithMeta => {
  return (
    funcWithMeta.hasOwnProperty("func") &&
    funcWithMeta.hasOwnProperty("meta") &&
    isSyncFunctionMetadata(funcWithMeta.meta)
  );
};

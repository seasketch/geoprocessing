import path from "node:path";

/**
 * Returns filename of handler, given full path to source file
 */
export function getHandlerFilenameFromSrcPath(srcPath: string) {
  let name = path.basename(srcPath);
  const parts = name.split(".");
  name = parts.slice(0, -1).join(".") + `Handler.js`;
  return name;
}

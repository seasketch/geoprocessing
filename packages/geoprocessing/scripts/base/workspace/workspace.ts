import { $ } from "zx";

/** Checks that docker is installed and runnable, throws error if not */
export async function verifyWorkspace() {
  try {
    await $`docker info > /dev/null 2>&1`;
  } catch (err: unknown) {
    throw new Error("Docker is not running, please start docker and try again");
  }
  return true;
}

/** Generate cloud-optimized GeoTIFF in geoprocessing workspace */
export async function genCog(
  /** path to src data.  Mounted as volume and accessible as /data/src in container by cmd */
  inPath: string,
  /** path to data output by cmd.  Mounted as volume and accessible as /data/out in container by cmd */
  outPath: string,
  /** path to scripts used by .  Mounted as volume and accessible as /data/bin in container by cmd */
  binPath: string,
  /** raster filename to import from inPath */
  inFile: string,
  /** raster filename to output to outPath */
  outFile: string,
  /** raster band number to import */
  band: number
) {
  // console.log("inPath", inPath);
  // console.log("outPath", outPath);
  // console.log("binPath", binPath);
  // console.log("inFile", inFile);
  // console.log("outFile", outFile);
  // console.log("band", band);

  // Uses readlink script to resolve symlinks, because docker can't mount a symlink path
  try {
    await $`docker run --rm -v "$(${binPath}/readlink.sh ${inPath})":/data/in -v "$(${binPath}/readlink.sh ${outPath})":/data/out -v "$(${binPath}/readlink.sh ${binPath})":/data/bin seasketch/geoprocessing-base /data/bin/genCog.sh /data/in/${inFile} /data/out ${outFile} ${band}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Workspace genCog failed");
      throw err;
    }
  }
  return true;
}

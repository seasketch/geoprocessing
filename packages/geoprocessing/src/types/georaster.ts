/** Typed array of data values, the basic building block of a geotiff */
export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

export declare function parseGeoraster(
  /** raster pixel data, accepts variety of forms */
  data: object | string | Buffer | ArrayBuffer | TypedArray[][],
  /** raster metadata */
  metadata?: GeorasterMetadata,
  /** whether or not to print debug statements */
  debug?: boolean,
): Promise<Georaster>;

/** defines the new raster image to generate as a window in the source raster image.  Resolution (cell size) is determined from this */
export interface WindowOptions {
  /** left side of the image window in pixel coordinates */
  left: number;
  /** top of the image window in pixel coordinates */
  top: number;
  /** right of the image window in pixel coordinates.  Should be greater than left */
  right: number;
  /** bottom of the image window in pixel coordinates.  Should be greater than top */
  bottom: number;
  /** width in pixels to make the resulting raster.  Will resample and/or use overview if not same as right - left */
  width: number;
  /** height in pixels to make the resulting raster.  Will resample and/or use overview if not same as bottom - top */
  height: number;
  /** method to map src raster values to result raster. Supports 'nearest' neighbor, defaults to 'bilinear' */
  resampleMethod?: string;
}

export interface Georaster {
  /** raster values for one or more bands.  Represented as [band, column, row] */
  values: TypedArray[][];
  /** raster height in units of projection */
  height: number;
  /** raster width in units of projection */
  width: number;
  /** raster height in pixels */
  pixelHeight: number;
  /** raster width in pixels */
  pixelWidth: number;
  /** Projection identifier */
  projection: number;
  /** left boundary, in units of projection*/
  xmin: number;
  /** right boundary, in units of projection */
  xmax: number;
  /** bottom boundary, in units of projection */
  ymin: number;
  /** top boundary, in units of projection */
  ymax: number;
  /** cell value representing "no data" in raster */
  noDataValue: number;
  /** number of raster bands */
  numberOfRasters: number;
  /** Minimum cell value for each raster band.  Indexed by band number */
  mins: number[];
  /** Maximum cell value for each raster band.  Indexed by band number */
  maxs: number[];
  /** difference between max and min for each raster band.  Indexed by band number */
  ranges: number[];
  /** if raster initialized with a URL, this method is available to fetch a
   * specific subset or 'window' without reading the entire raster into memory.
   * If the window options do not align exactly with the source image then a new
   * one is generated using the resampleMethod.  The best available overview will
   * also be used if they are available. */
  getValues?: (options: WindowOptions) => Promise<TypedArray[][]>;
  /** experimental! returns a canvas picture of the data. */
  toCanvas: (options: { height?: number; width?: number }) => ImageData;
}

export type GeorasterMetadata = Pick<
  Georaster,
  "noDataValue" | "projection" | "xmin" | "ymax" | "pixelWidth" | "pixelHeight"
>;

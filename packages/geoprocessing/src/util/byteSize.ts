/**
 * Get length of string in bytes
 * @param str
 * @returns size in bytes
 */
export const byteSize = (str: string) => {
  let size = Buffer.from(str).length;
  return size;
};

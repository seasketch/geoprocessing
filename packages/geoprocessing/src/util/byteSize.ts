/**
 * Get length of string in bytes
 * @param str
 * @returns size in bytes
 */
export const byteSize = (str: string) => {
  const size = Buffer.from(str).length;
  return size;
};

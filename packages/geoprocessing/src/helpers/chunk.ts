/**
 * Splits an array into chunks of size
 */
export function chunk<T>(array: T[], chunkSize: number): T[][] {
  const R: any[] = [];
  for (let i = 0, len = array.length; i < len; i += chunkSize)
    R.push(array.slice(i, i + chunkSize));
  return R;
}

/** Similar to lodash keyBy */
export const keyBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K,
) =>
  list.reduce(
    (previous, currentItem) => {
      const group = getKey(currentItem);
      return { ...previous, [group]: currentItem };
    },
    {} as Record<K, T>,
  );

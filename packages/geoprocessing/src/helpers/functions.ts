/** Similar to lodash groupBy */
export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) {
      return { ...previous, [group]: [currentItem] };
    }
    return { ...previous, [group]: previous[group].concat(currentItem) };
  }, {} as Record<K, T[]>);

/** Similar to lodash keyBy */
export const keyBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    return { ...previous, [group]: currentItem };
  }, {} as Record<K, T>);

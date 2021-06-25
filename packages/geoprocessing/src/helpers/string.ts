/** Capitalizes the first letter of string */
export const capitalize = (s) =>
  (s && s[0].toLocaleUpperCase() + s.slice(1)) || "";

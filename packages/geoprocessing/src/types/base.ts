export type Nullable<T> = T | null;
export type ISO8601Duration = string;
export type ISO8601DateTime = string;

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

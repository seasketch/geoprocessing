import { z } from "zod";
export type Nullable<T> = T | null;
export type ISO8601Duration = string;
export type ISO8601DateTime = string;

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

const jsonValueSchema = z.string().or(z.number()).or(z.boolean()).or(z.null());
//lazy circular references supporting nested JSON -- https://stackoverflow.com/a/75786078
const jsonArraySchema = z.lazy(() => z.array(jsonValueSchema));
const jsonRecordSchema = z.lazy(() => z.record(jsonValueSchema));
export const jsonSchema: z.ZodType<JSONValue> = z.union([
  jsonValueSchema,
  jsonArraySchema,
  jsonRecordSchema,
]);

import { percentWithEdge, roundDecimal } from "../helpers";

const NumberFormatter = new Intl.NumberFormat("en", { style: "decimal" });

/** Options for formatting a given value. */
export type ValueFormatter =
  | "value"
  | "number"
  | "number1dig"
  | "number2dig"
  | "integer"
  | "percent"
  | "percent0dig"
  | "percent1dig"
  | "percent2dig"
  | ((value: number | string) => number | string);

/** Given a number or string value and the name of a formatter function, returns a formatted value */
export const valueFormatter = (
  value: string | number,
  formatter: ValueFormatter
) => {
  if (formatter === "value") return value;
  if (formatter === "percent0dig")
    return percentWithEdge(
      typeof value === "string" ? parseFloat(value) : value,
      { digits: 0 }
    );
  if (formatter === "percent")
    return percentWithEdge(
      typeof value === "string" ? parseFloat(value) : value
    );
  if (formatter === "percent1dig")
    return percentWithEdge(
      typeof value === "string" ? parseFloat(value) : value,
      { digits: 1 }
    );
  if (formatter === "percent2dig")
    return percentWithEdge(
      typeof value === "string" ? parseFloat(value) : value,
      { digits: 2 }
    );
  if (formatter === "number")
    return NumberFormatter.format(
      typeof value === "string" ? parseFloat(value) : value
    );
  if (formatter === "number1dig")
    return NumberFormatter.format(
      roundDecimal(typeof value === "string" ? parseFloat(value) : value, 1)
    );
  if (formatter === "number2dig")
    return NumberFormatter.format(
      roundDecimal(typeof value === "string" ? parseFloat(value) : value, 2)
    );
  if (formatter === "integer")
    return NumberFormatter.format(parseInt(`${value}`));
  return formatter(value);
};

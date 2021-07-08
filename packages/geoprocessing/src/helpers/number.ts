/** Rounds a number to a fixed precision  */
export const roundDig = (value: number, decimals = 1) => {
  return Number(
    Math.round(parseFloat(`${value}e${decimals}`)) + `e-${decimals}`
  );
};

/** Formats number value as percent string with special handling of minimum bound */
export const percentLower = (
  val: number,
  { lower, digits } = { lower: 0.001, digits: 1 }
) => {
  const PercentFormatter = new Intl.NumberFormat("en", {
    style: "percent",
    maximumFractionDigits: digits,
  });

  return val < lower
    ? `< ${PercentFormatter.format(lower)}`
    : PercentFormatter.format(val);
};

/** Formats number to string, rounding decimal to number of digits, with special handling of minimum bound */
export const roundLower = (val: number, { lower } = { lower: 1 }) => {
  const NumberFormatter = new Intl.NumberFormat("en", { style: "decimal" });

  return val < lower ? `< ${lower}` : NumberFormatter.format(roundDig(val, 1));
};

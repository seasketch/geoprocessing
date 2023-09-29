export interface RoundDecimalOptions {
  /** If true, will keep any small value as-is which would be rounded to 0, defaults to false */
  keepSmallValues?: boolean;
}

/** Rounds a number to a fixed precision  */
export const roundDecimal = (
  /** Value to round */
  value: number,
  /** Number of digits after the decimal point to keep */
  decimals = 1,
  options: RoundDecimalOptions = { keepSmallValues: false }
) => {
  const roundedValue = Number(
    Math.round(parseFloat(`${value}e${decimals}`)) + `e-${decimals}`
  );

  return options.keepSmallValues && value && !roundedValue
    ? value
    : roundedValue;
};

export interface PercentEdgeOptions {
  /** Number of decimal digits to round value to if is within lower or upper edge range.  defaults to 1.  Override with this option */
  digits?: number;
  /** Number of decimal digits to round value to if exactly matches lowerBound, defaults to 0 (whole number)  */
  digitsIfMatchLower?: number;
  /** Define a lower value bound.  Defaults to 0 (zero). */
  lowerBound?: number;
  /** Enable special formatting of values from lowerBound up to lower value.  Defaults to .001 aka 1/10 of a percent */
  lower?: number;
  /** Optional string value to display if between zero and lower.  Overrides default special handling, no use of percent formatter.  Example - "< 0.1% for real" */
  lowerOverride?: string;
  /** Define an upper value bound.  Enable special formatting of values from upper to upperBound */
  upperBound?: number;
  /** Define lower bound to upper value.  Enable special formatting of values from upper to upperBound */
  upper?: number;
  /** Optional string value to display if between upper and upperBound.  Overrides default special handling, no use of percent formatter.  Example - "almost 20%, keep going!" */
  upperOverride?: string;
}

/**
 * Special percent formatter designed to produce readable percent values for
 * display with special handling of numbers within some edge range of
 * user-defined lower or upper bounds.  Defaults to handle only lower edge with
 * lowerBound = 0 and lower = .001. All bound values are expected to be in
 * decimal percent.  So 1/10th of a percent is .001
 */
export const percentWithEdge = (
  val: number,
  options: PercentEdgeOptions = {
    digits: 1,
    digitsIfMatchLower: 0,
    lower: 0.001,
    lowerBound: 0,
  }
) => {
  const {
    digits = 1,
    digitsIfMatchLower = 0,
    lower = 0.001,
    lowerBound = 0,
    lowerOverride,
    upper,
    upperBound,
    upperOverride,
  } = options;

  const PercentFormatter = new Intl.NumberFormat("en", {
    style: "percent",
    maximumFractionDigits: digits,
  });

  const MatchPercentFormatter = new Intl.NumberFormat("en", {
    style: "percent",
    maximumFractionDigits: digitsIfMatchLower,
  });

  if (val === lowerBound) {
    return MatchPercentFormatter.format(val);
  } else if (val > lowerBound && val < lower) {
    if (lowerOverride) {
      return lowerOverride;
    } else {
      return `< ${PercentFormatter.format(lower)}`;
    }
  } else if (
    upper !== undefined &&
    upperBound !== undefined &&
    val < upperBound &&
    val > upper
  ) {
    if (upperOverride) {
      return upperOverride;
    } else {
      return PercentFormatter.format(upper);
    }
  } else {
    return PercentFormatter.format(val);
  }
};

/**
 * Special percent formatter designed to produce readable percent values for display given an upper percent goal
 * All parameters are expected to be decimal percent values e.g. .001 = 1/10th of a percent.
 */
export const percentGoalWithEdge = (
  /** Actual percent value */
  val: number,
  /** Goal percent value */
  goal: number,
  /** Override options passed to percentWithEdge, supports same parameters */
  options?: PercentEdgeOptions
) => {
  return percentWithEdge(val, {
    upperBound: goal,
    upper: goal - 0.001,
    ...(options || {}),
  });
};

/** Formats number to string, rounding decimal to number of digits, with special handling of minimum bound */
export const roundLower = (val: number, { lower } = { lower: 1 }) => {
  const NumberFormatter = new Intl.NumberFormat("en", { style: "decimal" });

  return val < lower
    ? `< ${lower}`
    : NumberFormatter.format(roundDecimal(val, 1));
};

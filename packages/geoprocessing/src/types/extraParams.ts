/**
 * Common set of extra parameters that might be passed to a geoprocessing function
 * Replace or extend these as needed, there is nothing special about the param names other than
 * to be descriptive of what they represent.
 */
export interface DefaultExtraParams {
  /** IDs of one or more geographies to operate on */
  geographyIds?: string[];
  /** IDs of one or more countries to operate on */
  countryIds?: string[];
  /** Names of one or more eez to operate on */
  eezNames?: string[];
}

export interface GeogProp {
  geographyId: string;
}

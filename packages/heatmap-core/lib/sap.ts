export interface SapOptions {
  /** importance of this area (for example on a scale of 1-100) */
  importance?: number;
  /** factor to change the area by dividing. For example if area of geometry is calculated in square meters, an areaFactor of 1,000,000 will make the SAP per square km. because 1 sq. km = 1000m x 1000m = 1mil sq. meters */
  areaFactor?: number;
  /** numeric value to multiply the importance by.  Use to scale the SAP from being 'per respondent' to a larger group of livelihoods or even economic values  */
  importanceFactor?: number;
  /** limits the area of a shape in SAP calculation.  Gives shapes with high area an artifically lower one, increasing their SAP relative to others, increasing their presence in heatmap */
  maxArea?: number
  /** limits the SAP value. Gives shapes with high priority an artificially lower one, decreasing their presence in heatmap */
  maxSap?: number
}

/**
 * Given the geometric area of activity, calculates a spatial access priority (sap) value, a unitless representation of the importance of the geometric area.  With no additional options passed, defaults to basic unweighted sap where a unit of area is weighted equally and the larger the area, the lower the sap (1 / area).
 * @param area - geometric area of the spatial feature (e.g. square meters, km, feet, miles)
 * @param options - options to weight, scale, or set bounds
 * @returns sap value
 */
export function calcSap(area: number, options: SapOptions = {}) {
  const { importance = 1, areaFactor = 1, importanceFactor = 1, maxArea, maxSap } = options
  area = area / areaFactor
  
  if (maxArea) {
    area = Math.min(area, maxArea)
  }

  let sap = importanceFactor * importance / area

  if (maxSap) {
    sap = Math.min(sap, maxSap)
  }
  
  return sap
}
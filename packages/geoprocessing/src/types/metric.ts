import { ClassFeatureProps } from "./data";

export type AreaByClassMetric = ClassFeatureProps & {
  /** Total area with this habitat type */
  totalArea: number;
  /** Percentage of overall habitat with this habitat type */
  percArea: number;
  /** Total area within feature with this habitat type, rounded to the nearest meter */
  sketchArea: number;
};

/** Additional properties for gp functions calculating area by class */
export type AreaByClassMetricResult = {
  totalArea: number;
  areaByClass: AreaByClassMetric[];
  areaUnit: string;
};

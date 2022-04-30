import { ObjectiveAnswer, Objective } from "../types";
import { Metric } from "../types";

export type ZoneId = number;
export type ZoneName = string;
export type ZoneColor = string;
export type Zone = [string[], string, string, number];
export type MpaClassification = {
  scores: any[];
  index: number;
  indexLabel: string;
};

export const FULLY_PROTECTED_LEVEL = "Fully Protected Area";
export const HIGHLY_PROTECTED_LEVEL = "Highly Protected Area";
export const MODERATELY_PROTECTED_LEVEL = "Moderately Protected Area";
export const POORLY_PROTECTED_LEVEL = "Poorly Protected Area";
export const UNPROTECTED_LEVEL = "Unprotected Area";

export const rbcsMpaProtectionLevels = [
  FULLY_PROTECTED_LEVEL,
  HIGHLY_PROTECTED_LEVEL,
  MODERATELY_PROTECTED_LEVEL,
  POORLY_PROTECTED_LEVEL,
  UNPROTECTED_LEVEL,
] as const;

export type RbcsMpaProtectionLevel = typeof rbcsMpaProtectionLevels[number];

/**
 * Mapping of RBCS MPA Classification ID to whether it counts toward or meets an objective
 */
export type RbcsMpaObjectiveAnswerMap = Record<
  RbcsMpaProtectionLevel,
  ObjectiveAnswer
>;

export interface RbcsObjective extends Objective {
  /** Map of RBCS protection levels to whether they count towards objective */
  countsToward: RbcsMpaObjectiveAnswerMap;
}

/**
 * Extended metric for mpa-reg-based-classification results, either zone or mpa classification
 */
export interface RegBasedClassificationMetric extends Omit<Metric, "extra"> {
  sketchId: string;
  extra?: {
    gearTypes?: string[];
    aquaculture?: string;
    boating?: string;
    label?: string;
  };
}

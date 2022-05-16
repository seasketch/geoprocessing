//// BASE CLASSIFICATION ////

/** Unique string ID for classification given to sketches (e.g. zone classification, protection level) */
export type ClassificationId = string;

//// BASE OBJECTIVE ////

export const OBJECTIVE_YES = "yes";
export const OBJECTIVE_NO = "no";
export const OBJECTIVE_MAYBE = "maybe";

export const OBJECTIVE_GREEN = "#BEE4BE";
export const OBJECTIVE_YELLOW = "#FFE1A3";
export const OBJECTIVE_RED = "#F7A6B4";

/** Object mapping answers for whether sketch counts toward objective to stop light colors - green / yellow / red */
export const objectiveCountsColorMap = {
  OBJECTIVE_YES: OBJECTIVE_GREEN,
  OBJECTIVE_MAYBE: OBJECTIVE_YELLOW,
  OBJECTIVE_NO: OBJECTIVE_RED,
};

/** Readonly list of possible answers for whether sketch counts toward objective */
export const objectiveCountsAnswers = [
  OBJECTIVE_YES,
  OBJECTIVE_NO,
  OBJECTIVE_MAYBE,
] as const;

/** Unique name of objective */
export type ObjectiveId = string;

/** Range of possible answers for whether a classification counts towards or meets an objective */
export type ObjectiveAnswer = typeof objectiveCountsAnswers[number];

/**
 * Generic type for mapping classification ID to whether it counds toward or meets an objective
 * Specific classification systems will extend this type with short list of allowed classification IDs
 */
export type ObjectiveAnswerMap = Record<ClassificationId, ObjectiveAnswer>;

/**
 * Generic type for group of objectives
 */
export type ObjectiveGroup = Record<ObjectiveId, Objective>;

/** Base planning objective, extend as needed for specific classification system or ad-hoc */
export interface Objective {
  /** Unique identifier for objective */
  id: ObjectiveId;
  shortDesc: string;
  /** Value required for objective to be met */
  target: number;
  /** Generic map of MPA protection levels to whether they count towards objective */
  countsToward: Record<string, ObjectiveAnswer>;
}

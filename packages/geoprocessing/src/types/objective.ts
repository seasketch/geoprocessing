import { z } from "zod";

//// BASE CLASSIFICATION ////

/** Unique string ID for classification given to sketches (e.g. zone classification, protection level) */
export type ClassificationId = string;

/** Unique name of objective */
export type ObjectiveId = string;

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

//// SCHEMA ////

const OBJECTIVE_COUNTS_ANSWERS = [
  OBJECTIVE_YES,
  OBJECTIVE_NO,
  OBJECTIVE_MAYBE,
] as const;
export const objectiveAnswerSchema = z.enum(OBJECTIVE_COUNTS_ANSWERS);

export const objectiveAnswerMapSchema = z.record(objectiveAnswerSchema);

/** Base planning objective, extend as needed for specific classification system or ad-hoc */
export const objectiveSchema = z.object({
  /** Unique identifier for objective */
  objectiveId: z.string(),
  shortDesc: z.string(),
  /** Value required for objective to be met */
  target: z.number().nonnegative(),
  /** Generic map of group names (e.g. MPA protection levels) to whether they count towards objective */
  countsToward: objectiveAnswerMapSchema,
});

export const objectivesSchema = z.array(objectiveSchema);

//// INFERRED TYPES ////

export type ObjectiveAnswer = z.infer<typeof objectiveAnswerSchema>;
export type Objective = z.infer<typeof objectiveSchema>;
export type Objectives = z.infer<typeof objectivesSchema>;

/** Range of possible answers for whether a classification counts towards or meets an objective */
// export type ObjectiveAnswer = typeof objectiveCountsAnswers[number];

/**
 * Generic type for mapping classification ID to whether it counds toward or meets an objective
 * Specific classification systems will extend this type with short list of allowed classification IDs
 */
export type ObjectiveAnswerMap = Record<ClassificationId, ObjectiveAnswer>;

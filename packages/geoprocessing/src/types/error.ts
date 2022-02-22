/** Error signifying input is not valid */
export class ValidationError extends Error {}

/** Error signifying function threw due to not being able to handle the input - e.g. size/complexity */
export class ComplexityError extends Error {}

// Categorical data must have these attribute names
export const classIdAttribute = "class_id";
export const classNameAttribute = "class";

// Categorical vector data must have these properties
export interface ClassFeatureProps {
  class_id: number;
  class: string;
}

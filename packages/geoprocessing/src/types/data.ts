// Categorical data must have these attribute names
export const classIdAttribute = "class_id";
export const classNameAttribute = "class";

// Categorical data properties, class_id is used for raster data where integer maps to a class name
export interface ClassFeatureProps {
  class_id?: number;
  class: string;
}

import { DataClass } from "../types";

/** Returns mapping of class ID to class DataClass objects */
export const classIdMapping = (classes: DataClass[]) => {
  return classes.reduce<Record<string, string>>(
    (acc, curClass) => ({
      ...acc,
      ...(curClass.numericClassId
        ? { [curClass.numericClassId]: curClass.classId }
        : {}),
    }),
    {}
  );
};

import { SketchProperties, UserAttribute } from "../types/index.js";
import { useContext } from "react";
import { ReportContext } from "../context/index.js";

function useSketchProperties(): [
  SketchProperties,
  (exportId: string, defaultValue?: any) => any,
] {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("ReportContext could not be found.");
  }
  context.sketchProperties.userAttributes =
    context.sketchProperties.userAttributes || ([] as UserAttribute[]);
  return [
    context.sketchProperties,
    (exportId: string, defaultValue?: any): any => {
      const userAttribute = context.sketchProperties.userAttributes.find(
        (attr) => attr.exportId === exportId,
      );
      return userAttribute?.value || defaultValue;
    },
  ];
}

export default useSketchProperties;

import { SketchProperties } from "../types";
import { useContext } from "react";
import SketchContext from "../SketchContext";

const useSketchProperties = (): SketchProperties | null => {
  const context = useContext(SketchContext);
  if (context) {
    return context?.properties;
  } else {
    return null;
  }
};

export default useSketchProperties;

import { useContext } from "react";
import { ReportContext } from "../context";

function useVisibleLayers(): [string[], (layerId: string) => void] {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("ReportContext could not be found.");
  }
  /* Toggles the visibility of a given layer id */
  function toggleLayerVisibility(layerId: string) {
    if (context && context.toggleLayerVisibility) {
      context.toggleLayerVisibility(layerId);
    }
  }
  return [context.visibleLayers, toggleLayerVisibility];
}

export default useVisibleLayers;

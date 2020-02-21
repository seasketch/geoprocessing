import { useContext } from "react";
import ReportContext from "../ReportContext";
const useSketchProperties = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("ReportContext could not be found.");
    }
    return context.sketchProperties;
};
export default useSketchProperties;
//# sourceMappingURL=useSketchProperties.js.map
import { useContext } from "react";
import ReportContext from "../ReportContext";
function useSketchProperties() {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("ReportContext could not be found.");
    }
    context.sketchProperties.userAttributes =
        context.sketchProperties.userAttributes || [];
    return [
        context.sketchProperties,
        (exportId, defaultValue) => {
            var _a;
            const userAttribute = context.sketchProperties.userAttributes.find(attr => attr.exportId === exportId);
            return ((_a = userAttribute) === null || _a === void 0 ? void 0 : _a.value) || defaultValue;
        }
    ];
}
export default useSketchProperties;
//# sourceMappingURL=useSketchProperties.js.map
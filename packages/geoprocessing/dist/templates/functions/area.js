import { GeoprocessingHandler, sketchArea } from "@seasketch/geoprocessing";
async function calculateArea(sketch) {
    return {
        area: sketchArea(sketch)
    };
}
export default new GeoprocessingHandler(calculateArea, {
    title: "calculateArea",
    description: "Function description",
    timeout: 2,
    memory: 256,
    executionMode: "async",
    // Specify any Sketch Class form attributes that are required
    requiresProperties: []
});
//# sourceMappingURL=area.js.map
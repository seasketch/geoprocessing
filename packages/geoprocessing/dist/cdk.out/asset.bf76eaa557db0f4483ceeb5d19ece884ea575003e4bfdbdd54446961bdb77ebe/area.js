'use strict';
var geoprocessing = require('./geoprocessing-1e814ed3.js');
async function area(sketch) {
    return {
        area: geoprocessing.sketchArea()
    };
}
var area$1 = new geoprocessing.GeoprocessingHandler(area, {
    title: "area",
    description: "Produces the area of the given sketch",
    timeout: 2,
    memory: 256,
    executionMode: "sync",
    // Specify any Sketch Class form attributes that are required
    requiresProperties: []
});
module.exports = area$1;
//# sourceMappingURL=area.js.map
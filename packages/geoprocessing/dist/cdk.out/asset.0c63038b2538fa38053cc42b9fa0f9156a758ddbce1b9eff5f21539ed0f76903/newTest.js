'use strict';
var geoprocessing = require('./geoprocessing-1e814ed3.js');
async function newTest(sketch) {
    return {
        area: geoprocessing.sketchArea()
    };
}
var newTest$1 = new geoprocessing.GeoprocessingHandler(newTest, {
    title: "new",
    description: "test function",
    timeout: 2,
    memory: 256,
    executionMode: "sync",
    // Specify any Sketch Class form attributes that are required
    requiresProperties: []
});
module.exports = newTest$1;
//# sourceMappingURL=newTest.js.map
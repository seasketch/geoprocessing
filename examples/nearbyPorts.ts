import { handlerFactory } from "../src/handlers";
import { SeaSketchFeatureCollection } from '../src/geometry';
// import { FeatureCollection } from 'geojson';

// interface SeaSketchReportingHandler {
//   ( features: FeatureCollection, parameters: Map<string, any> ) : Promise<any>;
// }
// // interface SeaSketchReportingHandler () 

// const makeHander = (handler: SeaSketchReportingHandler) : any => {

// }

const nearbyPorts = handlerFactory(async (subject, parameters) => {
  const features = subject;
  if (subject instanceof SeaSketchFeatureCollection)
  const ports = await fetchPorts();
  const bounds = bbox(features);
  ports.reduce((list, port) => {
    port.distance = distance(features, port);
    list.push(port);
    return list;
  }, []);
  return ports.sort((a, b) => a.distance - b.distance).slice(0, 5);    
})

// const nearbyPorts = makeHander(async function(collection, parameters) {
//   const ports = await fetchPorts();
//   const bounds = bbox(features);
//   ports.reduce((list, port) => {
//     port.distance = distance(features, port);
//     list.push(port);
//     return list;
//   }, []);
//   return ports.sort((a, b) => a.distance - b.distance).slice(0, 5);    
// });

export default nearbyPorts;

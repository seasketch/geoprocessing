```ts


const nearbyPorts = async (features: SeaSketchFeatures, parameters: SeaSketchReportingParameters) => {
  const ports = await fetchPorts();
  const bounds = bbox(features);
  ports.reduce((list, port) => {
    port.distance = distance(features, port);
    list.push(port);
  }, []);
  return ports.sort((a, b) => a.distance - b.distance).slice(0, 5);
};

export default nearbyPorts;
```

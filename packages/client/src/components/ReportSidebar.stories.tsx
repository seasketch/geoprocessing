import React from 'react';
import ReportSidebar from './ReportSidebar';
import { Sketch } from '@seasketch/serverless-geoprocessing';
import { toDataURI } from '../index';

export default {
  component: ReportSidebar,
  title: 'Private|ReportSidebar'
};

const sketch: Sketch = {
  "type": "Feature",
  "properties": {
    "name": "Campus Point",
    "sketchClassId": "abc123",
    "updatedAt": new Date().toISOString()
  },
  "bbox": [0,1,2,3],
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          -119.94873046875,
          34.28445325435288
        ],
        [
          -119.78668212890624,
          34.28445325435288
        ],
        [
          -119.78668212890624,
          34.43749580157603
        ],
        [
          -119.94873046875,
          34.43749580157603
        ],
        [
          -119.94873046875,
          34.28445325435288
        ]
      ]
    ]
  }
};

export const areaReport = () => (
  <ReportSidebar 
    style={{position: 'relative'}} 
    sketchProperties={sketch.properties}
    geometryUri={toDataURI(sketch)}
    geoprocessingProjectUri="https://peartedq8b.execute-api.us-west-2.amazonaws.com/production/" 
    clientTitle="Example" 
  />
);

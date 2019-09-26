import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Card from './Card';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import ReportSidebar from './ReportSidebar';
import { BBox } from 'geojson';
import { Sketch } from '@seasketch/serverless-geoprocessing';

const sketch: Sketch = {
  "type": "Feature",
  "properties": {
    "name": "Campus Point"
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

const stories = storiesOf('Components', module)
  .addDecorator(withKnobs);

stories.add(
  'ReportSidebar',
  () => 
    <ReportSidebar style={{position: 'relative'}} sketch={sketch} geoprocessingProjectUri={text("geoprocessing project uri", "https://peartedq8b.execute-api.us-west-2.amazonaws.com/production/")} clientTitle={text("clientTitle", "Example")} />,
  {
    info: { text: "Usage instructions" },
    notes: {
      markdown: `
      ### Usage

      ~~~javascript
      <ReportSidebar 
        geoprocessingProjectUri="https://peartedq8b.execute-api.us-west-2.amazonaws.com/production/" 
        clientTitle="Example" 
        sketch="sketch" 
      />
      ~~~
    ` },
  }
);
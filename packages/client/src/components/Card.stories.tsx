import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Card from './Card';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import ReportDecorator from './ReportDecorator';

const stories = storiesOf('Components', module)
  .addDecorator(ReportDecorator)
  .addDecorator(withKnobs);

stories.add(
  'Card',
  () => 
    <Card title={text("title", "Card Title")}>
      <p>Body text goes here.</p>
    </Card>,
  {
    info: { text: "Usage instructions" },
    notes: {
      markdown: `
      ### Usage

      ~~~javascript
      <Card title="My Title">
        <p>My content</p>
      </Card>
      ~~~
    ` },
  }
);
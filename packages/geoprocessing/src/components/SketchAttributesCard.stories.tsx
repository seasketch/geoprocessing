import React from 'react';
import SketchAttributesCard from './SketchAttributesCard';
import ReportDecorator from './ReportDecorator';

export default {
  component: SketchAttributesCard,
  title: 'Components|SketchAttributesCard',
  decorators: [ReportDecorator],
};

export const simple = () => <SketchAttributesCard title="Attributes" />;

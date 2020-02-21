import React from 'react';
import Card from './Card';
import ReportDecorator from './ReportDecorator';
export default {
    component: Card,
    title: 'Components|Card',
    decorators: [ReportDecorator],
};
export const simple = () => React.createElement(Card, { title: "Card Title" },
    React.createElement("p", null, "Body text goes here."));
//# sourceMappingURL=Card.stories.js.map
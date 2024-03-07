import React from "react";
import { Card } from "../Card.js";

/**
 * Default decorator.  Create additional building on StoryLayout for more sophisticated needs
 */
export const CardDecorator = (storyFn): JSX.Element => {
  return <Card>{storyFn()}</Card>;
};
export default CardDecorator;

import React from "react";
import styled from "styled-components";

const SimpleButtonStyled = styled.button`
  background: transparent;
  border: none;
`;

/**
 * A simple button component that accepts any text value so unicode can be used including emojis
 */
const SimpleButton = ({ children, ...props }) => {
  return <SimpleButtonStyled {...props}>{children}</SimpleButtonStyled>;
};

export default SimpleButton;

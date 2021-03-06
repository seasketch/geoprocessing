import React from "react";
import styled from "styled-components";

export const SimpleButtonStyled = styled.button`
  background: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  outline: none;
  color: #aaa;
  font-size: 18px
  font-weight: bold
  &:hover {
    color: #333;
  }
`;

/**
 * A simple button component that accepts any text value so unicode can be used including emojis
 */
const SimpleButton = ({ children, ...props }) => {
  return <SimpleButtonStyled {...props}>{children}</SimpleButtonStyled>;
};

export default SimpleButton;

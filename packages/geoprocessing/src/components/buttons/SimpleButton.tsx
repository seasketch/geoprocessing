import React, { ReactNode } from "react";
import { styled } from "styled-components";

export const SimpleButtonStyled = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  color: #aaa;
  font-size: 18px
  font-weight: bold
  &:hover {
    color: #333;
  }
`;

export interface SimpleButtonProbs {
  children: ReactNode;
}

/**
 * A simple button component that accepts any text value so unicode can be used including emojis
 */
export const SimpleButton: React.FunctionComponent<SimpleButtonProbs> = ({
  children,
  ...props
}) => {
  return <SimpleButtonStyled {...props}>{children}</SimpleButtonStyled>;
};

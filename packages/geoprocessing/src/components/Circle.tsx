import React, { ReactNode } from "react";
import { styled } from "styled-components";

interface StyledCircleProps {
  color?: string;
  size?: number;
}

/** Default style for Circle */
export const StyledCircle = styled.span<StyledCircleProps>`
  background-color: ${(props) => props.color || "#DDD"};
  padding: 3px 5px;
  border-radius: ${(props) => (props.size ? `${props.size}px` : "17px")};
  min-width: ${(props) => (props.size ? `${props.size}px` : "17px")};
  max-width: ${(props) => (props.size ? `${props.size}px` : "17px")};
  height: ${(props) => (props.size ? `${props.size + 4}px` : "21px")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface CircleProps {
  children: ReactNode;
  color?: string;
  size?: number;
  ariaLabel?: string;
}

/** Circle with user-defined component inside */
export const Circle: React.FunctionComponent<CircleProps> = ({
  children,
  color,
  size,
  ariaLabel,
}) => {
  return (
    <StyledCircle
      color={color}
      size={size}
      aria-label={
        ariaLabel || `Circle highlighted with ${color || "#DDD"} color`
      }
    >
      {children}
    </StyledCircle>
  );
};

//// GROUP CIRCLE ////

export interface GroupCircleProps {
  /** React component to put inside the circle */
  children: ReactNode;
  /** Group to use for this circle */
  group: string;
  /** Mapping of group names to color */
  groupColorMap: Record<string, string>;
}

/**
 * Circle with user-defined group colors
 */
export const GroupCircle: React.FunctionComponent<GroupCircleProps> = ({
  children,
  group,
  groupColorMap,
}) => {
  return (
    <Circle
      color={groupColorMap[group]}
      ariaLabel={`Circle highlighted with group ${group} color ${groupColorMap[group]}`}
    >
      {children}
    </Circle>
  );
};

import React, { ReactNode } from "react";
import { styled } from "styled-components";

export const StyledPill = styled.span`
  background-color: ${(props) => props.color || "#CCC"};
  border-radius: 6px;
  padding: 3px 5px;
`;

export interface PillProps {
  children: ReactNode;
  color?: string;
}

export const Pill: React.FunctionComponent<PillProps> = ({
  children,
  color,
}) => {
  return <StyledPill color={color}>{children}</StyledPill>;
};

export interface PillColumnProps {
  children: ReactNode;
}

export const PillColumn: React.FunctionComponent<PillColumnProps> = ({
  children,
}) => {
  return (
    <span style={{ display: "flex" }}>
      {children}
      <span style={{ flex: 1 }}></span>
    </span>
  );
};

export interface GroupPillProps {
  group: string;
  groupColorMap: Record<string, string>;
  children: ReactNode;
}

/**
 * Pill with colors assigned to each group name
 */
export const GroupPill: React.FunctionComponent<GroupPillProps> = ({
  group,
  groupColorMap,
  children,
}) => {
  return (
    <Pill color={groupColorMap[group]} aria-label={`Group: ${group}`}>
      {children}
    </Pill>
  );
};

export const WarningPill: React.FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Pill color={"#FFE1A3"} aria-label="Warning Highlight">
      {children}
    </Pill>
  );
};

export const GreenPill: React.FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Pill aria-label={"Green Highlight"} color={"#BEE4BE"}>
      {children}
    </Pill>
  );
};

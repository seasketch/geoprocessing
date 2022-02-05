import React, { ReactNode } from "react";
import styled from "styled-components";

export interface CollapseProps {
  title: string;
  children: ReactNode;
  collapsed?: boolean;
}

const StyledCollapse = styled.div`
  .collapse-header {
    margin-top: 15px;
    display: flex;
    height: 20px;
  }

  .collapse-icon-container {
    margin-left: -3px;
  }

  .collapse-icon-button {
    display: block;
    border: 0;
    margin-bottom: 10px;
    padding-left: 0px;
    background-color: transparent;
    font-size: 15px;
    height: 20px;
    width: 25px;
    color: #777;
    cursor: pointer;
  }

  .collapse-text-button {
    display: block;
    border: 0;
    margin-bottom: 10px;
    padding-left: 0px;
    background-color: transparent;
    font-size: 15px;
    height: 20px;
    font-weight: bold;
    color: #777;
    cursor: pointer;
  }

  .collapse-content {
    margin-left: 15px;
    background-color: transparent;
    & p {
      margin: 10px 0px;
    }
  }

  .collapse-content.collapsed {
    display: none;
  }

  .collapsed-content.expanded {
    display: block;
  }
`;

export const Collapse: React.FunctionComponent<CollapseProps> = ({
  collapsed = true,
  children,
  title,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

  return (
    <StyledCollapse>
      <div className="collapse-header">
        <div className="collapse-icon-container">
          <button
            className="collapse-icon-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
        </div>
        <button
          className="collapse-text-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {title}
        </button>
      </div>
      <div
        className={`collapse-content ${isCollapsed ? "collapsed" : "expanded"}`}
        aria-expanded={isCollapsed}
      >
        {children}
      </div>
    </StyledCollapse>
  );
};

///////////

const StyledCollapseGroup = styled.div`
  margin-top: 15px;
  & .collapse-header {
    margin-top: 0px;
  }
`;

export interface CollapseGroupProps {
  children: ReactNode;
}

export const CollapseGroup: React.FunctionComponent<CollapseGroupProps> = ({
  children,
}) => {
  return <StyledCollapseGroup>{children}</StyledCollapseGroup>;
};

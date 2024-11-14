import { CaretDownFill, CaretRightFill } from "@styled-icons/bootstrap";
import React, { ReactNode } from "react";
import { styled } from "styled-components";

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

  .collapse-button {
    display: flex;
    align-items: center;
    border: 0;
    background-color: transparent;
    font-size: 15px;
    font-weight: bold;
    color: #767676;
    cursor: pointer;
    padding: 0;
    margin-bottom: 10px;
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

  .collapse-content.expanded {
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
    <StyledCollapse
      aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
      aria-expanded={!isCollapsed}
      role="button"
    >
      <div className="collapse-header">
        <button
          className="collapse-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <CaretRightFill
              size={15}
              style={{ marginRight: "5px" }}
              aria-hidden="true"
            />
          ) : (
            <CaretDownFill
              size={15}
              style={{ marginRight: "5px" }}
              aria-hidden="true"
            />
          )}{" "}
          {title}
        </button>
      </div>
      <div
        className={`collapse-content ${isCollapsed ? "collapsed" : "expanded"}`}
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

import React, { useState, useRef } from "react";
import { styled } from "styled-components";
import { usePopper } from "react-popper";
import popper from "@popperjs/core";

export interface TooltipContainerProps {
  /* Whether tooltip contain is visible or not */
  $visible: boolean;
}

/**
 * Renders an element with a tooltip
 */
export interface TooltipProps {
  /* Text to present in tooltip */
  text: string;
  /* The base element which opens a tooltip on hover */
  children: React.ReactElement;
  /* How to place the tooltip, defaults to 'auto'. See types or https://popper.js.org/ for available placements */
  placement?: popper.Placement;
  /* Distance pixels to offset from children */
  offset?: { horizontal: number; vertical: number };
  /* Width in pixels of tooltip */
  width?: number;
}

export const TooltipContainer = styled.div<TooltipContainerProps>`
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  max-width: 200px;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  font-size: 12px;
  font-weight: normal;
`;

export const TooltipTrigger = styled.button`
  border: none;
  background: none;
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
`;

export const TooltipItem = styled.div`
  text-align: center;
  padding: 5px;
`;

export const Tooltip = ({
  children,
  placement = "auto",
  offset = { horizontal: 0, vertical: 0 },
  text,
  width = 200,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  /** Used for updates */
  const referenceRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const { horizontal, vertical } = offset;
  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      placement,
      modifiers: [
        {
          name: "offset",
          enabled: true,
          options: {
            offset: [horizontal, vertical],
          },
        },
      ],
    },
  );

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (popperRef.current) popperRef.current.style.zIndex = "100";
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    if (popperRef.current) popperRef.current.style.zIndex = "-100";
  };

  return (
    <>
      <TooltipTrigger
        ref={referenceRef}
        style={children.props.style}
        onMouseOver={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        aria-label={`Tooltip: ${text}`}
      >
        {children}
      </TooltipTrigger>
      <div
        ref={popperRef}
        style={{ zIndex: -100, ...styles.popper }}
        {...attributes.popper}
      >
        <TooltipContainer
          style={{ ...styles.offset, width: width }}
          $visible={isVisible}
        >
          <TooltipItem>{text}</TooltipItem>
        </TooltipContainer>
      </div>
    </>
  );
};

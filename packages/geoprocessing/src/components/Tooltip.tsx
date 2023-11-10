import React, { useState, useRef } from "react";
import styled from "styled-components";
import { usePopper } from "react-popper";
import popper from "@popperjs/core";

export interface TooltipContainerProps {
  /* Whether tooltip contain is visible or not */
  visible: boolean;
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
}

export const TooltipContainer = styled.div<TooltipContainerProps>`
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  z-index: 100;
  width: 100%;
  max-width: 200px;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
`;

export const TooltipTrigger = styled.button`
  border: none;
  background: none;
  font-family: sans-serif;
`;

export const TooltipItem = styled.div`
  font-family: sans-serif;
  text-align: center;
  padding: 5px;
`;

export const Tooltip = ({
  children,
  placement = "auto",
  offset = { horizontal: 0, vertical: 0 },
  text,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  /** Used for updates */
  const referenceRef = useRef(null);
  const popperRef = useRef(null);

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
    }
  );

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <React.StrictMode>
      <TooltipTrigger
        ref={referenceRef}
        onMouseOver={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </TooltipTrigger>
      <div
        ref={popperRef}
        style={{ zIndex: 100, ...styles.popper }}
        {...attributes.popper}
      >
        <TooltipContainer style={styles.offset} visible={isVisible}>
          <TooltipItem>{text}</TooltipItem>
        </TooltipContainer>
      </div>
    </React.StrictMode>
  );
};

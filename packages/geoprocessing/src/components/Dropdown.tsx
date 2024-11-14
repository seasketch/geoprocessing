import React, { useState, useRef } from "react";
import { styled } from "styled-components";
import { usePopper } from "react-popper";
import popper from "@popperjs/core";
import useClickOutside from "../hooks/useClickOutside.js";

export interface DropdownContainerProps {
  /* Whether dropdown contain is rendered (open) or not */
  open: boolean;
}

/**
 * Renders an element with a dropdown list
 */
export interface DropdownProps {
  /* Child components to list in dropdown.  Each is wrapped in a DropdownItem */
  children: React.ReactNode;
  /* The base element which opens a dropdown onClick, typically a button */
  titleElement?: React.ReactElement;
  /* How to place the dropdown, defaults to 'auto'.  See types or https://popper.js.org/ for available placements */
  placement?: popper.Placement;
  /* Distance pixels to offset from titleElement */
  offset?: { horizontal: number; vertical: number };
}

export const DropdownContainer = styled.div<DropdownContainerProps>`
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  display: ${({ open }) => (open ? "flex" : "none")};
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.14);
`;

export const DropdownItem = styled.div`
  font-family: sans-serif;
  justify-content: flex-start;
  padding: 5px;
  &:hover {
    background-color: #efefef;
  }
  &:active {
    color: #777;
  }
  a[aria-disabled="true"] {
    color: currentColor;
    text-decoration: none;
    cursor: not-allowed;

    & button {
      cursor: not-allowed;
    }
  }
`;

export const DropdownTrigger = styled.button`
  border: none;
  background: none;
  font-family: sans-serif;
  cursor: pointer;
`;

export const Dropdown = ({
  titleElement = <></>,
  placement = "auto",
  offset = { horizontal: 0, vertical: 0 },
  children,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  /** Used for updates */
  const referenceRef = useRef(null);
  const popperRef = useRef(null);

  /* Listens for click outside the source element that opens the dropdown
   * and toggles accordingly */
  const toggle = () => setOpen(!open);
  const { ref: DropownRef } = useClickOutside(setOpen);

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

  function handleDropdownClick(e: any) {
    e.preventDefault();
    toggle();
  }

  return (
    <div ref={DropownRef} aria-label="Dropdown">
      <DropdownTrigger
        ref={referenceRef}
        onClick={handleDropdownClick}
        aria-label={`${open ? "Close" : "Open"} dropdown menu`}
        aria-expanded={open}
      >
        {titleElement}
      </DropdownTrigger>
      <div
        ref={popperRef}
        style={{ zIndex: 1000, ...styles.popper }}
        {...attributes.popper}
      >
        <DropdownContainer
          style={styles.offset}
          open={open}
          aria-label="Dropdown Menu"
        >
          {children &&
            React.Children.map(children, (child) => {
              return <DropdownItem>{child}</DropdownItem>;
            })}
        </DropdownContainer>
      </div>
    </div>
  );
};

export default Dropdown;

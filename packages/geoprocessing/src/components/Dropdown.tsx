import React, { FC, useState, useRef } from "react";
import styled from "styled-components";
import { usePopper } from "react-popper";
import { Placement } from "@popperjs/core";
import useHandleClickOutside from "../hooks/useClickOutside";

interface DropdownContainerProps {
  open: boolean;
}

/**
 *
 */
interface DropDownProps {
  children: React.ReactNode;
  titleElement?: React.ReactElement;
  placement?: Placement;
  offset?: { horizontal: number; vertical: number };
}

const DropdownContainer = styled.div<DropdownContainerProps>`
  display: ${({ open }) => (open ? "flex" : "none")};
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.14);
`;

const DropdownItem = styled.div`
  font-family: sans-serif;
  justify-content: flex-start;
  padding: 5px;
  &:hover {
    background-color: #efefef;
  }
  &:active {
    color: #777;
  }
`;

const DropDownTrigger = styled.button`
  border: none;
  background: none;
  font-family: sans-serif;
`;

const Dropdown = ({
  titleElement: TitleElement = <></>,
  placement = "auto",
  offset = { horizontal: 0, vertical: 0 },
  children,
}: DropDownProps) => {
  const [open, setOpen] = useState(false);

  /** Used for updates */
  const referenceRef = useRef(null);
  const popperRef = useRef(null);

  const toggle = () => setOpen(!open);

  const { ref: DropDownRef } = useHandleClickOutside(setOpen);

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

  function handleDropdownClick(e: any) {
    e.preventDefault();
    toggle();
  }

  return (
    <>
      <div ref={DropDownRef}>
        <DropDownTrigger
          type="button"
          ref={referenceRef}
          onClick={handleDropdownClick}
        >
          {TitleElement}
        </DropDownTrigger>
      </div>
      <div ref={popperRef} style={styles.popper} {...attributes.popper}>
        <DropdownContainer style={styles.offset} open={open}>
          {children &&
            React.Children.map(children, (child) => {
              return <DropdownItem>{child}</DropdownItem>;
            })}
        </DropdownContainer>
      </div>
    </>
  );
};

export default Dropdown;

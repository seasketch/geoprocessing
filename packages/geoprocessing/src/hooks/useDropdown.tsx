import React, { useEffect } from "react";
import styled from "styled-components";
import usePortal, { UsePortalOptions } from "react-useportal";

const Dropdown = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  padding: 5px;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
`;

type DropdownOptions = UsePortalOptions & {
  width: number;
  height?: number;
};

const useDropdown = ({ width, height, onOpen, ...config }: DropdownOptions) => {
  const { isOpen, togglePortal, Portal, ref: targetRef, portalRef } = usePortal(
    {
      onOpen(args) {
        const { portal, targetEl } = args;
        const clickedEl = targetEl.current;
        console.log("clickedEl", clickedEl);
        const { top, bottom, left, right } = clickedEl.getBoundingClientRect();
        const h = height || 0;
        let l = left;
        let t = top + clickedEl.clientHeight;
        const outRight = window.innerWidth < left + clickedEl.offsetWidth;
        const outBottom =
          window.innerHeight < top + portal.current.clientHeight;
        const outTop = false;
        const outLeft = false;
        if (outRight) {
          l = window.innerWidth - (right - left + clickedEl.offsetWidth);
        } else if (outLeft) {
          /* very uncommon, implement later */
        }
        if (outBottom) {
          t = window.innerHeight - (bottom - top + h);
        } else if (outTop) {
          /* very uncommon, implement later */
        }
        portal.current.style.cssText = `
        width: ${width || clickedEl.offsetWidth}px;
        position: absolute;
        top: ${t}px;
        left: ${l}px;
        background: #ffff;
			`;
        if (onOpen) onOpen(args);
      },
      onScroll({ portal }) {
        console.log("SCROLLING");
        // TODO: add logic so when scrolling, the portal doesn't get displaced
      },
      ...config,
    }
  );

  return {
    Dropdown: (props: React.HTMLAttributes<HTMLDivElement>) => (
      <Portal>
        <Dropdown {...props} />
      </Portal>
    ),
    toggleDropdown: togglePortal,
    isOpen,
  };
};

export default useDropdown;

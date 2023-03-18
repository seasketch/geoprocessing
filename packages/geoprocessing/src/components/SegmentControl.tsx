import React, { useRef, useState, useEffect } from "react";

export interface SegmentControlProps {
  segments: { id: string; label: string }[];
  value: string;
  onClick?: (segment: string) => void;
  // disabled?: boolean;
}

export const SegmentControl = (props: SegmentControlProps) => {
  const index = props.segments.findIndex((seg) => seg.id === props.value);
  const [segmentSizes, setSegmentSizes] = useState<number[]>();
  const containerRef = useRef<HTMLDivElement>(null);
  if (index === -1) {
    throw new Error(
      `Unknown SegmentControl id ${props.value} for segments ${JSON.stringify(
        props.segments
      )}`
    );
  }
  let position = "0px";
  // let position = `${(index / props.segments.length) * 100}%`;
  if (segmentSizes) {
    const widths = segmentSizes.slice(0, index).reduce((px, w) => (px += w), 0);
    position = `${widths}px`;
  }

  useEffect(() => {
    if (containerRef.current) {
      const sizes: number[] = [];
      for (const child of containerRef.current.childNodes) {
        child as HTMLSpanElement;
        if (child.nodeName === "SPAN") {
          const span = child as HTMLSpanElement;
          if (span.getAttribute("role") !== "button") {
            sizes.push(span.clientWidth);
          }
        }
      }
      setSegmentSizes(sizes);
    }
  }, [containerRef.current]);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "rgba(229, 231, 235, 1)",
        display: "flex",
        flexBasis: "content",
        borderRadius: "0.375rem",
        position: "relative",
        border: "2px solid black",
        borderColor: "rgba(229, 231, 235, 1)",
      }}
      ref={containerRef}
    >
      <span
        role="button"
        style={{
          transitionProperty: "all",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "75ms",
          left: position,
          width: `${segmentSizes ? segmentSizes[index] : 0}px`,
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          borderRadius: "0.25rem",
          padding: "0.125rem",
          // paddingTop: "0.25rem",
          // paddingBottom: "0.25rem",

          backgroundColor: "white",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          //         --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          // box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
          position: "absolute",
        }}
        // className="transition-all duration-75 text-sm rounded p-0.5 bg-white shadow-md absolute focus:ring focus:ring-blue-200"
      >
        &nbsp;
      </span>
      {props.segments.map((segment) => (
        <span
          onClick={(e) => {
            if (props.onClick) {
              props.onClick(segment.id);
            }
          }}
          key={segment.id}
          style={{
            color: "rgba(31, 41, 55, 1)",
            userSelect: "none",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            flex: "1 1 auto",
            textAlign: "center",
            cursor: "pointer",
            borderRadius: "0.375rem",
            padding: "0.125rem",
            // paddingTop: "0.25rem",
            // paddingBottom: "0.25rem",
            zIndex: 10,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          className="text-gray-800 select-none text-sm flex-1 text-center cursor-pointer rounded-md p-0.5 z-10"
        >
          {segment.label}
        </span>
      ))}
    </div>
  );
};

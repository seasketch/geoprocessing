import React, { useRef, useState, useEffect } from "react";
export interface SegmentControlProps {
  segments: { id: string; label: string }[];
  value: string;
  onClick?: (segment: string) => void;
}

export const SegmentControl = (props: SegmentControlProps) => {
  const index = props.segments.findIndex((seg) => seg.id === props.value);
  // Initialize approximate segment width
  const [segmentWidth, setSegmentWidth] = useState<number>(
    480 / props.segments.length,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  if (index === -1) {
    throw new Error(
      `Unknown SegmentControl id ${props.value} for segments ${JSON.stringify(
        props.segments,
      )}`,
    );
  }

  // Update segment width when container is fully rendered
  useEffect(() => {
    if (containerRef.current?.clientWidth)
      setSegmentWidth(containerRef.current.clientWidth / props.segments.length);
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
        style={{
          transitionProperty: "all",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "75ms",
          insetInlineStart: `${segmentWidth * index}px`,
          width: `${segmentWidth - 4}px`,
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          borderRadius: "0.25rem",
          padding: "0.125rem",
          backgroundColor: "white",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          position: "absolute",
        }}
        aria-hidden="true"
      >
        &nbsp;
      </span>
      {props.segments.map((segment) => (
        <button
          onClick={() => {
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
            width: `${segmentWidth}px`,
            cursor: "pointer",
            borderRadius: "0.375rem",
            padding: "0.125rem",
            background: "transparent",
            border: "none",
            zIndex: 10,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          className="text-gray-800 select-none text-sm flex-1 text-center cursor-pointer rounded-md p-0.5 z-10"
          aria-pressed={props.value === segment.id}
          aria-label={`Open ${segment.label} Tab`}
        >
          {segment.label}
        </button>
      ))}
    </div>
  );
};

import React from "react";
import useVisibleLayers from "../hooks/useVisibleLayers.js";
import { Stack } from "@styled-icons/bootstrap/Stack/Stack.esm.js";

export function LayerToggle({
  layerId,
  label = "",
  style,
  simple,
  size = "regular",
}: {
  layerId?: string;
  label?: string;
  style?: React.CSSProperties;
  simple?: boolean;
  size?: "small" | "regular";
}) {
  const [visibleLayers, toggleLayer] = useVisibleLayers();

  if (!layerId) return <></>;
  const on = visibleLayers.includes(layerId);

  return (
    <span
      style={{
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        // flexDirection: "row-reverse",
        width: "100%",
        cursor: "pointer",
        ...style,
      }}
    >
      {!simple && (
        <>
          <Stack
            className="toggle-button"
            size={24}
            style={{ marginRight: 10, color: "#A4CEDE" }}
            onClick={() => toggleLayer(layerId)}
          />
          <label
            style={{
              flex: 1,
              height: 12,
              width: 12,
              color: "#555",
              cursor: "pointer",
            }}
            htmlFor={label + layerId}
            onClick={() => toggleLayer(layerId)}
          >
            {label}
          </label>
        </>
      )}
      {simple && label && label.length > 0 && (
        <>
          <label
            style={{
              height: 12,
              color: on === true ? "#62ACC4" : "#AAA",
              cursor: "pointer",
              textAlign: "right",
              fontSize: "0.8em",
              marginRight: 6,
            }}
            htmlFor={label + layerId}
            onClick={() => toggleLayer(layerId)}
          >
            {label}
          </label>
        </>
      )}
      <button
        type="button"
        id={label + layerId}
        style={{
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionProperty:
            "background-color, border-color, color, fill, stroke",
          backgroundColor: on === true ? "#6FC2DE" : "rgba(229, 231, 235, 1)",
          position: "relative",
          display: "inline-flex",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          height: size === "regular" ? "1.5rem" : "1.25rem",
          width: size === "regular" ? "2.75rem" : "2.25rem",
          borderColor: "transparent",
          borderWidth: 2,
          borderRadius: 9999,
          cursor: "pointer",
          outline: "none",
          boxSizing: "border-box",
          padding: 0,
        }}
        // className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-pressed={on}
        onClick={() => toggleLayer(layerId)}
      >
        {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
        <span
          style={{
            transform: `translateX(${
              on ? (size === "regular" ? "1.25rem" : "1.00rem") : "0px"
            })`,
            background: "white",
            pointerEvents: "none",
            width: size === "regular" ? "1.25rem" : "1.00rem",
            height: size === "regular" ? "1.25rem" : "1.00rem",
            borderRadius: 9999,
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
          aria-hidden="true"
          className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
        >
          {simple && (
            <Stack size="15" color={on === true ? "#6FC2DE" : "#AAA"} />
          )}
        </span>
      </button>
    </span>
  );
}

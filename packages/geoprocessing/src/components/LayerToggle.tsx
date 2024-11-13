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
    <button
      onClick={() => toggleLayer(layerId)}
      aria-pressed={on}
      aria-label={"Toggle " + label + (on ? " off" : " on")}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: simple ? "flex-end" : "space-between",
        width: "100%",
        cursor: "pointer",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "8px",
        ...style,
      }}
    >
      {!simple && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Stack
            size={24}
            style={{
              marginRight: 10,
              color: on ? "#62ACC4" : "#A4CEDE",
            }}
            aria-hidden={true}
          />
          <span
            style={{
              color: "#555",
              fontSize: "15px",
            }}
          >
            {label}
          </span>
        </div>
      )}
      {simple && (
        <span
          style={{
            color: on ? "#62ACC4" : "#555",
            fontSize: ".9em",
            marginRight: 5,
            textAlign: "right",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          position: "relative",
          width: size === "regular" ? "2.75rem" : "2.25rem",
          height: size === "regular" ? "1.5rem" : "1.25rem",
          backgroundColor: on ? "#6FC2DE" : "rgba(229, 231, 235, 1)",
          borderRadius: "9999px",
          transition: "background-color 200ms ease",
          display: "flex",
          alignItems: "center",
          padding: "1px 0px",
          marginRight: simple ? "8px" : "0",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: on
              ? `calc(100% - ${size === "regular" ? 1.25 : 1}rem - 4px)`
              : `4px`,
            width: size === "regular" ? "1.25rem" : "1.00rem",
            height: size === "regular" ? "1.25rem" : "1.00rem",
            backgroundColor: "white",
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            transition: "left 200ms ease",
          }}
        >
          {simple && (
            <Stack
              size={size === "regular" ? 15 : 12}
              color={on === true ? "#6FC2DE" : "#AAA"}
              aria-hidden={true}
            />
          )}
        </span>
      </div>
    </button>
  );
}

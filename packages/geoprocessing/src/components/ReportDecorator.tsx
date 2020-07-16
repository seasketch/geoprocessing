import React, { CSSProperties, useState } from "react";

const containerStyle = {
  height: "auto",
  border: "1px solid rgba(0,0,0,0.12)",
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: 2,
  position: "relative",
} as CSSProperties;

const styles = {
  backgroundColor: "#efefef",
  padding: 8,
  margin: 0,
  boxSizing: "border-box",
  boxShadow:
    "0px 0px 0px transparent, 0px 4px 4px 0px rgba(0, 0, 0, 0.06) inset, 0px 0px 0px transparent, 0px 0px 0px transparent",
} as CSSProperties;

const headerStyle = {
  fontFamily: "sans-serif",
  padding: 10,
  backgroundColor: "#f5f5f5",
  zIndex: 2,
  borderBottom: "1px solid rgba(0,0,0,0.13)",
};

// @ts-ignore
const ReportWindow = ({ storyFn }: { storyFn }) => {
  const [width, setWidth] = useState(500);
  return (
    <>
      <div style={{ width, ...containerStyle }}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: 18, fontWeight: 500 }}>Sketch Name</h1>
        </div>
        <div style={{ ...styles, width }}>{storyFn()}</div>
        <select
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
          style={{ position: "absolute", bottom: -30 }}
        >
          <option value={500}>Desktop - Standard Size</option>
          <option value={800}>Desktop - Large</option>
          <option value={320}>iPhone 5</option>
          <option value={375}>iPhone 6, iPhone X</option>
          <option value={414}>iPhone 6 Plus, iPhone 8 Plus, iPhone XR</option>
          <option value={360}>Galaxy S5</option>
          <option value={412}>Nexus 5x</option>
          <option value={540}>Pixel</option>
        </select>
      </div>
    </>
  );
};

// @ts-ignore
export default (storyFn) => <ReportWindow storyFn={storyFn} />;

import React from 'react';

export interface Props {
  title?: string;
  children: React.ReactNode,
  style?: object
}

const boxStyle = {
  fontFamily: 'sans-serif',
  borderRadius: 4,
  backgroundColor: "#fff",
  boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
  padding: 16,
  margin: "8px 0px"
}

const titleStyle = {
  fontSize: 14,
  color: "rgba(0, 0, 0, 0.54)",
  marginBottom: "0.35em",
  marginTop: 0,
  fontWeight: 400,
}

const Card = ({ children, title, style }: Props) => {
  return <div style={{...boxStyle, ...(style || {})}}>
    {title && title.length && <h2 style={titleStyle}>{title}</h2>}
    {children}
  </div>
}

export default Card;

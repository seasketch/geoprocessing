import React from "react";
import styled from "styled-components";

export interface StyledLegendProps {
  blockGroupColors: (string | undefined)[];
}

const StyledLegend = styled.div<StyledLegendProps>`
  h3,
  h6 {
    margin: 0;
    line-height: 1em;
  }
  h3 {
    margin-bottom: 1em;
  }
  h6 {
    font-size: 0.8em;
    padding: 0 0.5em 0.5em 0;
    width: 5em;
    text-align: right;
    color: #666;
  }
  figure {
    margin: 1em auto;
    max-width: 1100px;
    position: relative;
  }
  .graphic {
    padding-left: 10px;
  }

  .chart {
    position: relative;
    overflow: visible;
    width: 0%;
    animation: expand 1.5s ease forwards;
  }

  .x-axis {
    text-align: center;
    padding: 0em 0 0.5em;
  }

  .legend {
    margin: 0 auto;
    padding: 0;
    font-size: 0.9em;
  }
  .legend li {
    display: inline-block;
    padding: 0.25em 1em;
    line-height: 1em;
  }
  .legend li:before {
    content: "";
    margin-right: 0.5em;
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #334d5c;
  }

  ${(props) =>
    props.blockGroupColors.map(
      (blockGroupColor, index) =>
        `
      .legend li:nth-of-type(${index + 1}):before {
        background-color: ${blockGroupColor};
      }
    `
    )}

  @media screen and (min-width: 768px) {
    h6 {
      padding: 0 0.5em 0.5em 0;
      width: 5em;
      float: left;
    }
    .legend {
      width: 80%;
    }
  }
`;

export interface LegendProps {
  blockGroupNames: string[];
  /** Style for each block group */
  blockGroupStyles: NonNullable<React.HTMLAttributes<HTMLElement>["style"]>[];
}

/**
 * Horizontal stacked bar chart component
 */
export const ChartLegend: React.FunctionComponent<LegendProps> = ({
  blockGroupNames,
  ...rest
}) => {
  const blockGroupStyles = rest.blockGroupStyles
    ? rest.blockGroupStyles
    : [
        { backgroundColor: "blue" },
        { backgroundColor: "green" },
        { backgroundColor: "gray" },
      ];

  return (
    <StyledLegend
      blockGroupColors={blockGroupStyles.map((style) => style.backgroundColor)}
    >
      <figure>
        <div className="x-axis">
          <ul className="legend">
            {blockGroupNames.map((blockGroupName) => (
              <li>{blockGroupName}</li>
            ))}
          </ul>
        </div>
      </figure>
    </StyledLegend>
  );
};

//@ts-nocheck
import React, { useState, ReactNode } from "react";
// @ts-ignore
import styled from "styled-components";
// @ts-ignore
const LoadingLabelDiv = styled.div`
  display: inline-block;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;
// @ts-ignore
const EstimateDiv = styled.div`
  display: inline-block;
  text-align: center;
  font-style: italic;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

//@ts-ignore
const BaseBox = styled.div`
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 3px;
  transition: width 1s ease-in-out;
`;

// @ts-ignore
const ProgressBarStyle = styled.div`
  display: inline-block;
  height: auto;
  border-radius: 2px;
  width: 100%;
  background: linear-gradient(-100deg, #f0f0f0 0%, #fafafa 50%, #f0f0f0 100%);
  background-size: 400% 400%;
  animation: pulse 1.2s ease-in-out ${(props) => props.estimate};
  margin-bottom: 4px;
  margin-top: 4px;
  @keyframes pulse {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -135% 0%;
    }
  }
  &::before {
    content: "d";
    opacity: 0;
  }
`;
const ProgressBar = (estimate: any) => (
  <div>
    <ProgressBarStyle estimate />
  </div>
);

export default function LoadingSkeleton(task: any) {
  let estimate =
    task.estimate === undefined ? "20" : Math.round(task.estimate / 1000) + 1;

  return (
    <div>
      <LoadingLabelDiv>Analyzing Designs</LoadingLabelDiv>

      <ProgressBar props={estimate} />
      <EstimateDiv>
        {task.estimate === undefined
          ? "time estimate unknown"
          : Math.round(task.estimate / 1000 + 1) + " seconds "}
      </EstimateDiv>
    </div>
  );
}

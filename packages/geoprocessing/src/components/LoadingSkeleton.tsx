//@ts-nocheck
import React, { useState, useEffect } from "react";
// @ts-ignore
//import ProgressBar from "./ProgressBar";
import styled, { keyframes } from "styled-components";
import ProgressBar from "./ProgressBar";

//const keyframes = styled.keyframes;
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

export default function LoadingSkeleton(task: any) {
  let taskEstimate = 5;
  if (task && task.estimate) {
    taskEstimate = Math.round(task.estimate + 1000 / 1000);
  }

  return (
    <div>
      <div>Hi</div>
      <LoadingLabelDiv>Analyzing Designs</LoadingLabelDiv>

      <ProgressBar duration={taskEstimate + "s"}></ProgressBar>
    </div>
  );
}

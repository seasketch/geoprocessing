//@ts-nocheck
import React, { useState, ReactNode } from "react";
// @ts-ignore
import styled, { keyframes } from "styled-components";

const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;

//@ts-ignore
export const ProgressBar = styled.div`
  background: #cbd7e1;
  height: 16px;
  animation: ${fill} linear 20;
  animation-duration: ${(props: any) => props.duration + "s"};
  margin-top: 0px;
  margin-bottom: 0px;
  border-radius: 3px;
`;

//@ts-ignore
export const ProgressBarWrapper = styled.div`
  height: 16px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  border-color: lightgray;
  border-style: solid;
  border-width: 0.25px;
`;

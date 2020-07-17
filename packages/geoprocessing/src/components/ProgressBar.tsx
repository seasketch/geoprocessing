//@ts-nocheck
import React, { useState, ReactNode } from "react";
// @ts-ignore
import styled, { keyframes } from "styled-components";

const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;

export const ProgressBar = styled.div`
  background: #5ac8fa;
  height: 20px;
  animation: ${fill} linear 20;
  animation-duration: ${(props) => props.duration + "s"};
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

export default ProgressBar;

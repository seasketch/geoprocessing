import { styled, keyframes } from "styled-components";

const fill = keyframes`
  0% {
      background-position: 100% 0%;
    }
  100% {
    background-position: 0% 0%;
  }
`;

interface Props {
  duration: number;
}

export const ProgressBar = styled.div<Props>`
  background: #ddd;
  height: 4px;
  background: linear-gradient(90deg, #ddd 50%, white 50%);
  background-size: 200% 200%;
  background-position: 0%;
  animation: ${fill} linear;
  animation-iteration-count: once;
  /* animation-timing-function: ease-in-out; */
  animation-duration: ${(props) => props.duration + "s"};
  position: relative;
`;

//@ts-ignore
export const ProgressBarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  overflow: hidden;
  border-radius: 0px 0px 4px 4px;
`;

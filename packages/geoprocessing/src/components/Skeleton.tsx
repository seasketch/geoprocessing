import styled from "styled-components";

// styled-components are needed here to use the ::before pseudo selector
export const Skeleton = styled.div`
  display: inline-block;
  height: 16px;
  border-radius: 3px;
  width: 100%;
  background: linear-gradient(-100deg, #f0f0f0 0%, #fafafa 50%, #f0f0f0 100%);
  background-size: 400% 400%;
  animation: pulse 1.2s ease-in-out infinite;
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

export default Skeleton;

import React from "react";
import Card from "./Card";
import styled from "styled-components";
import { logger } from "../util";

// styled-components are needed here to use the ::before pseudo selector
const ErrorIndicator = styled.div`
  display: inline-block;
  font-weight: bold;
  font-size: 18px;
  line-height: 1em;
  background-color: #ea4848;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  color: white;
  text-align: center;
  margin-right: 8px;
  ::before {
    position: relative;
    bottom: -1px;
    content: "!";
  }
`;

const ErrorCard = () => {
  return (
    <Card>
      <div role="alert">
        <ErrorIndicator />
        Something went wrong. Please close this report and try again.
      </div>
      <p>If it persists, press the "help" button above to report the issue.</p>
    </Card>
  );
};

export class ReportError extends React.Component {
  state = {
    hasError: false,
    error: { message: "", stack: "" },
    info: { componentStack: "" },
  };

  static getDerivedStateFromError = (error) => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };

  render() {
    const { hasError, error, info } = this.state;

    if (hasError) logger.info(error.message, info);
    const { children } = this.props;

    return hasError ? <ErrorCard /> : children;
  }
}

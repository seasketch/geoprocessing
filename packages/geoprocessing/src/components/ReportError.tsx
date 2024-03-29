import React from "react";
import Card from "./Card";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Card>
      <div role="alert">
        <ErrorIndicator />
        {t(
          "ReportError - message part 1",
          "Something went wrong. Please close this report and try again."
        )}
      </div>
      <p>
        {t(
          "ReportError - message part 2",
          "If the error persists, please report it."
        )}
      </p>
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

    if (hasError) console.info(error.message, info);
    const { children } = this.props;

    return hasError ? <ErrorCard /> : children;
  }
}

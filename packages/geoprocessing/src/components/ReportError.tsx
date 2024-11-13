import React from "react";
import Card from "./Card.js";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { ErrorStatus } from "./ErrorStatus.js";

const ErrorCard = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <div role="alert">
        <ErrorStatus
          msg={
            <>
              {t(
                "An error occurred while rendering this component. If the error persists, please report it.",
              )}
            </>
          }
        />
      </div>
    </Card>
  );
};

interface ReportErrorProps {
  children: React.ReactNode;
}

interface ReportErrorState {
  hasError: boolean;
  error: {
    message: string;
    stack: string;
  };
  info: {
    componentStack: string;
  };
}

export class ReportError extends React.Component<
  ReportErrorProps,
  ReportErrorState
> {
  state = {
    hasError: false,
    error: { message: "", stack: "" },
    info: { componentStack: "" },
  };

  static getDerivedStateFromError = () => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };
  static propTypes: {
    children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
  };

  render() {
    const { hasError, error, info } = this.state;

    if (hasError) console.info(error.message, info);
    const { children } = this.props;

    return hasError ? <ErrorCard /> : children;
  }
}

ReportError.propTypes = {
  children: PropTypes.node,
};

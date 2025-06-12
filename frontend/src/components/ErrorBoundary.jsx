import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={`p-6 rounded-lg bg-red-50 dark:bg-red-900/20 ${this.props.className || ""}`}>
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {this.state.error?.message || this.props.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={this.handleRetry}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  error: PropTypes.object,
  onRetry: PropTypes.func,
  className: PropTypes.string,
};

export default ErrorBoundary;
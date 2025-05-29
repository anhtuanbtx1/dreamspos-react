import React from 'react';
import './LoadingButton.scss';

const LoadingButton = ({
  loading = false,
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loadingText = 'Loading...',
  spinnerType = 'spinner',
  onClick,
  type = 'button',
  ...props
}) => {
  const handleClick = (e) => {
    if (!loading && !disabled && onClick) {
      onClick(e);
    }
  };

  const renderSpinner = () => {
    switch (spinnerType) {
      case 'spinner':
        return <div className="btn-spinner"></div>;
      case 'dots':
        return (
          <div className="btn-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      case 'pulse':
        return <div className="btn-pulse"></div>;
      default:
        return <div className="btn-spinner"></div>;
    }
  };

  return (
    <button
      type={type}
      className={`loading-btn ${variant} ${size} ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      disabled={loading || disabled}
      {...props}
    >
      <span className={`btn-content ${loading ? 'loading' : ''}`}>
        {loading && (
          <span className="btn-loader">
            {renderSpinner()}
          </span>
        )}
        <span className="btn-text">
          {loading ? loadingText : children}
        </span>
      </span>
    </button>
  );
};

export default LoadingButton;

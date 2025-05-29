import React, { useState, useEffect } from 'react';
import './EnhancedLoader.scss';

const EnhancedLoader = ({ 
  type = 'modern', 
  size = 'medium', 
  color = 'primary',
  text = 'Loading...',
  showText = true,
  overlay = true,
  progress = null 
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const renderLoader = () => {
    switch (type) {
      case 'modern':
        return (
          <div className={`modern-loader ${size} ${color}`}>
            <div className="loader-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`pulse-loader ${size} ${color}`}>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
        );

      case 'wave':
        return (
          <div className={`wave-loader ${size} ${color}`}>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        );

      case 'spinner':
        return (
          <div className={`spinner-loader ${size} ${color}`}>
            <div className="spinner-circle">
              <div className="spinner-inner"></div>
            </div>
          </div>
        );

      case 'dots':
        return (
          <div className={`dots-loader ${size} ${color}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );

      case 'gradient':
        return (
          <div className={`gradient-loader ${size} ${color}`}>
            <div className="gradient-spinner"></div>
          </div>
        );

      case 'bounce':
        return (
          <div className={`bounce-loader ${size} ${color}`}>
            <div className="bounce-ball"></div>
            <div className="bounce-ball"></div>
            <div className="bounce-ball"></div>
          </div>
        );

      default:
        return (
          <div className={`modern-loader ${size} ${color}`}>
            <div className="loader-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`enhanced-loader-container ${overlay ? 'with-overlay' : ''}`}>
      <div className="enhanced-loader-content">
        {renderLoader()}
        
        {showText && (
          <div className="loader-text">
            <span className="loading-message">{text}{dots}</span>
            {progress !== null && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{progress}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLoader;

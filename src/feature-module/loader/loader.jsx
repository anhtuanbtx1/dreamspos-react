import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { EnhancedLoader } from '../../components/Loading';

const Loader = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  const showLoader = () => {
    setLoading(true);
    setProgress(0);
  };

  const hideLoader = () => {
    setLoading(false);
    setProgress(100);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    showLoader();

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    const timeoutId = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        hideLoader();
      }, 200);
    }, 800);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
    };
  }, [location.pathname]);

  return (
    <div>
      {loading && (
        <EnhancedLoader
          type="modern"
          size="large"
          color="primary"
          text="Loading page"
          showText={true}
          overlay={true}
          progress={Math.round(progress)}
        />
      )}
      <Routes>
        <Route path="/"/>
      </Routes>
    </div>
  );
};

export default Loader;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CustomPagination = ({
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  totalPages = 1,
  loading = false,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showInfo = true,
  showPageSizeSelector = true,
  compact = false,
  className = ''
}) => {
  // Theme state for force re-render
  const [themeKey, setThemeKey] = useState(0);
  
  // Get theme from Redux and localStorage fallback
  const reduxTheme = useSelector((state) => state.theme?.isDarkMode);
  const localStorageTheme = localStorage.getItem('colorschema') === 'dark_mode';
  const documentTheme = document.documentElement.getAttribute('data-layout-mode') === 'dark_mode';
  
  const isDarkMode = reduxTheme || localStorageTheme || documentTheme;

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeKey(prev => prev + 1);
    };

    // Listen for data-layout-mode attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-layout-mode') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-layout-mode']
    });

    // Also listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'colorschema') {
        handleThemeChange();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate pagination info
  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  // Handle page change
  const handlePageClick = (page) => {
    if (!loading && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  // Handle page size change
  const handlePageSizeClick = (newPageSize) => {
    if (!loading && newPageSize !== pageSize && onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // Container styles based on compact mode
  const containerStyles = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
      : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
    border: isDarkMode 
      ? '1px solid rgba(52, 152, 219, 0.3)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: compact ? '8px' : '12px',
    boxShadow: isDarkMode 
      ? (compact ? '0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(52, 152, 219, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(52, 152, 219, 0.1)')
      : (compact ? '0 1px 6px rgba(0, 0, 0, 0.06)' : '0 2px 12px rgba(0, 0, 0, 0.08)'),
    backdropFilter: isDarkMode ? (compact ? 'blur(8px)' : 'blur(10px)') : 'none',
    transition: compact ? 'all 0.2s ease' : 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    padding: compact ? '8px 16px' : '16px 24px',
    margin: compact ? '8px 0' : '16px 0',
    fontSize: compact ? '13px' : '14px'
  };

  // Button styles
  const getButtonStyles = (isActive) => ({
    background: loading
      ? (isDarkMode ? 'linear-gradient(45deg, #7f8c8d, #95a5a6)' : 'linear-gradient(135deg, #f8f9fa, #e9ecef)')
      : isActive
      ? (isDarkMode ? 'linear-gradient(45deg, #f39c12, #e67e22)' : 'linear-gradient(135deg, #007bff, #0056b3)')
      : (isDarkMode ? 'linear-gradient(45deg, #34495e, #2c3e50)' : 'linear-gradient(135deg, #ffffff, #f8f9fa)'),
    border: isActive
      ? (isDarkMode ? (compact ? '1px solid #f39c12' : '2px solid #f39c12') : (compact ? '1px solid #007bff' : '2px solid #007bff'))
      : (isDarkMode ? '1px solid rgba(52, 152, 219, 0.3)' : '1px solid #dee2e6'),
    borderRadius: '50%',
    width: compact ? '24px' : '32px',
    height: compact ? '24px' : '32px',
    color: isActive 
      ? '#ffffff' 
      : (isDarkMode ? '#ffffff' : '#495057'),
    fontSize: compact ? '11px' : '14px',
    fontWeight: compact ? '600' : '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: compact ? 'all 0.2s ease' : 'all 0.3s ease',
    boxShadow: loading
      ? 'none'
      : isActive
      ? (isDarkMode ? (compact ? '0 2px 6px rgba(243, 156, 18, 0.3)' : '0 4px 12px rgba(243, 156, 18, 0.4)') : (compact ? '0 2px 4px rgba(0, 123, 255, 0.2)' : '0 3px 8px rgba(0, 123, 255, 0.3)'))
      : (isDarkMode ? (compact ? '0 1px 4px rgba(52, 73, 94, 0.2)' : '0 2px 8px rgba(52, 73, 94, 0.3)') : (compact ? '0 1px 2px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.1)')),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: loading ? 0.6 : 1
  });

  return (
    <div
      key={`pagination-${themeKey}`}
      className={`custom-pagination-container ${isDarkMode ? '' : 'light-mode'} ${className}`}
      style={containerStyles}
    >
      {/* Pagination Info */}
      {showInfo && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: compact ? '8px' : '16px',
            flexWrap: 'wrap',
            gap: compact ? '8px' : '12px'
          }}
        >
          {showPageSizeSelector && (
            <div style={{display: 'flex', alignItems: 'center', gap: compact ? '6px' : '12px'}}>
              <span style={{color: isDarkMode ? '#bdc3c7' : '#2c3e50', fontSize: compact ? '12px' : '14px', fontWeight: '500'}}>Số hàng mỗi trang</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeClick(parseInt(e.target.value))}
                disabled={loading}
                style={{
                  background: loading
                    ? (isDarkMode ? 'linear-gradient(45deg, #7f8c8d, #95a5a6)' : 'linear-gradient(135deg, #f8f9fa, #e9ecef)')
                    : (isDarkMode ? 'linear-gradient(45deg, #34495e, #2c3e50)' : 'linear-gradient(135deg, #ffffff, #f8f9fa)'),
                  border: isDarkMode 
                    ? '1px solid rgba(52, 152, 219, 0.3)'
                    : '1px solid #dee2e6',
                  borderRadius: compact ? '4px' : '6px',
                  color: isDarkMode ? '#ffffff' : '#495057',
                  padding: compact ? '2px 6px' : '4px 8px',
                  fontSize: compact ? '12px' : '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: isDarkMode ? 'none' : (compact ? '0 1px 2px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.1)')
                }}
              >
                {pageSizeOptions.map(option => (
                  <option 
                    key={option} 
                    value={option} 
                    style={{background: isDarkMode ? '#2c3e50' : '#ffffff', color: isDarkMode ? '#ffffff' : '#495057'}}
                  >
                    {option}
                  </option>
                ))}
              </select>
              <span style={{color: isDarkMode ? '#bdc3c7' : '#2c3e50', fontSize: compact ? '12px' : '14px', fontWeight: '500'}}>bản ghi</span>
            </div>
          )}

          <div style={{display: 'flex', alignItems: 'center', gap: compact ? '6px' : '12px'}}>
            <div
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(45deg, #3498db, #2ecc71)'
                  : 'linear-gradient(45deg, #007bff, #28a745)',
                borderRadius: '50%',
                width: compact ? '16px' : '24px',
                height: compact ? '16px' : '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: compact ? '8px' : '12px',
                boxShadow: isDarkMode 
                  ? (compact ? '0 1px 4px rgba(52, 152, 219, 0.3)' : '0 2px 8px rgba(52, 152, 219, 0.3)')
                  : (compact ? '0 1px 4px rgba(0, 123, 255, 0.2)' : '0 2px 8px rgba(0, 123, 255, 0.2)'),
                transition: compact ? 'all 0.2s ease' : 'all 0.3s ease'
              }}
            >
              📊
            </div>
            <span style={{color: isDarkMode ? '#bdc3c7' : '#2c3e50', fontSize: compact ? '12px' : '14px', fontWeight: '500'}}>
              Xem <strong style={{color: isDarkMode ? '#3498db' : '#007bff'}}>{startRecord}</strong> đến <strong style={{color: isDarkMode ? '#3498db' : '#007bff'}}>{endRecord}</strong> của <strong style={{color: isDarkMode ? '#e74c3c' : '#dc3545'}}>{totalCount}</strong> bản
            </span>
          </div>
        </div>
      )}

      {/* Pagination Buttons */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: compact ? '4px' : '8px'
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              disabled={loading}
              style={getButtonStyles(isActive)}
              onMouseEnter={(e) => {
                if (!loading && !isActive) {
                  e.target.style.background = isDarkMode 
                    ? 'linear-gradient(45deg, #3498db, #2980b9)'
                    : 'linear-gradient(135deg, #e9ecef, #f8f9fa)';
                  e.target.style.transform = isDarkMode ? (compact ? 'scale(1.05)' : 'scale(1.1)') : (compact ? 'translateY(-1px) scale(1.02)' : 'translateY(-1px) scale(1.05)');
                  e.target.style.boxShadow = isDarkMode 
                    ? (compact ? '0 2px 6px rgba(52, 152, 219, 0.3)' : '0 4px 12px rgba(52, 152, 219, 0.4)')
                    : (compact ? '0 2px 4px rgba(0, 0, 0, 0.12)' : '0 3px 8px rgba(0, 0, 0, 0.15)');
                  e.target.style.borderColor = isDarkMode ? '#3498db' : '#adb5bd';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !isActive) {
                  e.target.style.background = isDarkMode 
                    ? 'linear-gradient(45deg, #34495e, #2c3e50)'
                    : 'linear-gradient(135deg, #ffffff, #f8f9fa)';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = isDarkMode 
                    ? (compact ? '0 1px 4px rgba(52, 73, 94, 0.2)' : '0 2px 8px rgba(52, 73, 94, 0.3)')
                    : (compact ? '0 1px 2px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.1)');
                  e.target.style.borderColor = isDarkMode ? 'rgba(52, 152, 219, 0.3)' : '#dee2e6';
                }
              }}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomPagination;

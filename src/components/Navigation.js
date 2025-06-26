import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Target } from 'feather-icons-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/calendar',
      name: 'Calendar',
      icon: <Calendar size={20} />,
      description: 'Quản lý lịch trình và sự kiện'
    },
    {
      path: '/projects',
      name: 'Project Tracker',
      icon: <Target size={20} />,
      description: 'Theo dõi tiến độ dự án'
    }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      padding: '1rem 0'
    }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'white',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            padding: '8px 12px',
            marginRight: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            📅
          </div>
          Calendar & Project Hub
        </Link>

        <div className="navbar-nav ms-auto d-flex flex-row gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link d-flex align-items-center ${
                location.pathname === item.path ? 'active' : ''
              }`}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                background: location.pathname === item.path 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'transparent',
                backdropFilter: location.pathname === item.path 
                  ? 'blur(10px)' 
                  : 'none',
                border: location.pathname === item.path 
                  ? '1px solid rgba(255,255,255,0.3)' 
                  : '1px solid transparent',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.backdropFilter = 'blur(10px)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.background = 'transparent';
                  e.target.style.backdropFilter = 'none';
                }
              }}
            >
              <span className="me-2">{item.icon}</span>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {item.name}
                </span>
                <small style={{ 
                  fontSize: '11px', 
                  opacity: '0.8',
                  display: location.pathname === item.path ? 'block' : 'none'
                }}>
                  {item.description}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

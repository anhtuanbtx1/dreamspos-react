import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Target, Moon, Sun } from 'feather-icons-react';

const Navigation: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
          <Link
            to="/calendar"
            className={`nav-link d-flex align-items-center ${
              isActive('/calendar') ? 'active' : ''
            }`}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              background: isActive('/calendar')
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
              backdropFilter: isActive('/calendar')
                ? 'blur(10px)'
                : 'none',
              border: isActive('/calendar')
                ? '1px solid rgba(255,255,255,0.3)'
                : '1px solid transparent',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
          >
            <Calendar size={20} className="me-2" />
            <span>Calendar</span>
          </Link>

          <Link
            to="/projects"
            className={`nav-link d-flex align-items-center ${
              isActive('/projects') ? 'active' : ''
            }`}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              background: isActive('/projects')
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
              backdropFilter: isActive('/projects')
                ? 'blur(10px)'
                : 'none',
              border: isActive('/projects')
                ? '1px solid rgba(255,255,255,0.3)'
                : '1px solid transparent',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
          >
            <Target size={20} className="me-2" />
            <span>Projects</span>
          </Link>

          <button
            className="btn btn-outline-light"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              borderRadius: '25px',
              padding: '10px 15px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

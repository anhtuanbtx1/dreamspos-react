import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calendar from './pages/Calendar';
import ProjectTracker from './pages/ProjectTracker';
import Navigation from './components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/projects" element={<ProjectTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

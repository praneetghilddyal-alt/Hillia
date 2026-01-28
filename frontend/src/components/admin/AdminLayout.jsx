import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, clearAdminSession } from '../../services/adminApi';

/**
 * Admin Layout - Minimal wrapper for admin pages
 * Text-first, no visual decoration
 */
const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());

  useEffect(() => {
    // Check auth status on mount and when storage changes
    const checkAuth = () => {
      setIsAuthenticated(isAdminAuthenticated());
    };
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-wordmark">HILLIA</span>
          <span className="admin-label">Reading Room</span>
        </div>
        <nav className="admin-nav">
          <a href="/admin" className="admin-nav-link">Overview</a>
          <a href="/admin/questionnaire" className="admin-nav-link">Questionnaire</a>
          <a href="/admin/contact" className="admin-nav-link">Contact</a>
          <button onClick={handleLogout} className="admin-nav-link admin-logout">Exit</button>
        </nav>
      </header>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

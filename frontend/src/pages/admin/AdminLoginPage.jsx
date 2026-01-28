import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAdminAuth, isAdminAuthenticated } from '../../services/adminApi';

/**
 * Admin Login Page
 * Simple, secure, intentionally limited
 */
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await verifyAdminAuth(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <span className="admin-login-wordmark">HILLIA</span>
          <span className="admin-login-subtitle">Reading Room</span>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form" data-testid="admin-login-form">
          <div className="admin-form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="admin-form-input"
              autoComplete="username"
              required
              disabled={isLoading}
              data-testid="admin-username-input"
            />
          </div>
          
          <div className="admin-form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="admin-form-input"
              autoComplete="current-password"
              required
              disabled={isLoading}
              data-testid="admin-password-input"
            />
          </div>

          {error && (
            <div className="admin-login-error" data-testid="admin-login-error">{error}</div>
          )}

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={isLoading || !username || !password}
            data-testid="admin-login-submit"
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import network from '../libs/network';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      location.state &&
      location.state.loginError
    ) {
      toast.error(location.state.loginError);
      // Clear the state after showing the toast so it doesn't repeat
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.key, location.pathname, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await network.post('/auth/login', {
        email: email.toLowerCase(),
        password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = res.data;
      // Do NOT set access token in cookie, backend sets httpOnly cookie
      // Store user info for header display
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful!');
      }
      // Redirect to /App
      navigate('/App');
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || 'Login failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <div className="login-left">
        <img src="login1.svg" alt="Team Login" className="login-bg" />
      </div>
      <div className="login-form">
        <img src="Vector.svg" alt="Uolo Logo" className="logo" />
        <h2>Welcome back!</h2>
        <p className="subtitle">Log in to continue and access all the features</p>
        <form className="login-form-fields" onSubmit={handleSubmit}>
          <label htmlFor="email">Enter Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default LoginPage;

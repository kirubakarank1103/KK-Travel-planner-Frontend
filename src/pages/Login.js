import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80" alt="bg" />
        <div className="auth-overlay"></div>
      </div>

      <div className="auth-container animate-fadeInUp">
        <div className="auth-logo">✈ VOYAGER</div>
        <h2>Welcome Back</h2>
        <div className="gold-divider"></div>
        <p className="auth-sub">Continue your adventure</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-gold auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80" alt="bg" />
        <div className="auth-overlay"></div>
      </div>

      <div className="auth-container animate-fadeInUp">
        <div className="auth-logo">✈ VOYAGER</div>
        <h2>Create Account</h2>
        <div className="gold-divider"></div>
        <p className="auth-sub">Begin your journey with us</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input name="confirm" type="password" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-gold auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;